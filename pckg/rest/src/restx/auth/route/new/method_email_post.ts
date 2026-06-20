import * as cst from "@fst/cst"
import * as eu from "@fst/express-utils"
import { auth__hash_new, auth__salt_new } from "@src/restx/auth/util/crypto"
import { access_acc_strict } from "@src/util/access/acc_strict"
import type { Cluster_Route } from "@src/util/cluster/type/cluster"
import { db } from "@src/db/init"
import { v7 as uuid } from "uuid"
import * as z from "zod"

export type RestX_AuthRouteNewMethodEmailPost_Params = {
}

export const restx_auth_route_new_method_email_post = function(params: RestX_AuthRouteNewMethodEmailPost_Params) {
    const schema_body = z.object({
        owner: z.uuid(),
        email: z.email(),
        password: z.string().max(255),
    }).strict()

    return {
        schema: {
            body: schema_body,
        },

        handler: eu.route_new_path({
            method: "post",
            path: "/restx/auth/match/email",

            middleware: [
                eu.middleware_new_cookie(),
                eu.middleware_new_json_short(),
            ],

            handler: async ({ req, res }) => {
                const auth_id = uuid()
                const creation_date = Date.now()

                const body = eu.input_parse_zod(schema_body, req.body)

                await db.transaction().execute(async trx => {
                    const acc_auth = await access_acc_strict(req, res)
                    const acc_target = await db.selectFrom("acc").selectAll().where("acc.id", "=", body.owner).executeTakeFirst()

                    if (!acc_target) {
                        throw eu.error_new_custom(400, cst.ServerError.BadReq)
                    }

                    // only allow to change the auth of yourself and lower access users
                    if (acc_auth.id !== acc_target.id && acc_auth.access <= acc_target.access) {
                        throw eu.error_new_custom(403, cst.ServerError.BadAuth)
                    }

                    const password_salt = auth__salt_new()
                    const password_hash = auth__hash_new(body.password, password_salt)

                    // check if email is taken
                    {
                        const auth_repeats = await (trx
                            .selectFrom("acc_authemail")
                            .selectAll()
                            .where("email", "=", body.email)
                            .limit(1)
                            .execute()
                        )

                        if (auth_repeats.length > 0) {
                            throw eu.error_new_custom(403, cst.ServerError.BadReq)
                        }
                    }

                    if (acc_target.status_sessional === 1) {
                        await (trx
                            .updateTable("acc")
                            .set({
                                status_sessional: 0,
                                contact_email: acc_target.contact_email ?? body.email,
                            })
                            .where("acc.id", "=", acc_target.id)
                            .execute()
                        )
                    }

                    // insert auth
                    await (trx
                        .insertInto("acc_authemail")
                        .values({
                            deleted: 0,
                            creation_date,

                            id: auth_id,
                            owner: body.owner,

                            email: body.email,

                            password_salt,
                            password_hash,
                        })
                        .executeTakeFirstOrThrow()
                    )
                })

                return eu.response_new_json({
                    status: 200,

                    body: {
                        deleted: 0 as 0 | 1,
                        creation_date,

                        id: auth_id,
                        owner: body.owner,

                        email: body.email,
                    },
                })
            },
        })
    } satisfies Cluster_Route
}
