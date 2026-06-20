import * as cst from "@fst/cst"
import * as eu from "@fst/express-utils"
import { auth__comparator_timesafe, auth__hash_new, auth__salt_new } from "@src/restx/auth/util/crypto"
import { access_acc_strict } from "@src/util/access/acc_strict"
import type { Cluster_Route } from "@src/util/cluster/type/cluster"
import { db } from "@src/db/init"
import * as z from "zod"

export type RestX_AuthRouteNewMethodEmailPatch_Params = {
}

export const restx_auth_route_new_method_email_patch = function(params: RestX_AuthRouteNewMethodEmailPatch_Params) {
    const schema_body = z.object({
        id: z.uuid(),
        owner: z.uuid(),

        verification: z.object({
            password: z.string(),
        }),

        patch: z.object({
            password: z.string().optional(),
        }),
    }).strict()

    return {
        schema: {
            body: schema_body,
        },

        handler: eu.route_new_path({
            method: "patch",
            path: "/restx/auth/match/email",

            middleware: [
                eu.middleware_new_cookie(),
                eu.middleware_new_json_short(),
            ],

            handler: async ({ req, res }) => {
                const body = eu.input_parse_zod(schema_body, req.body)

                await db.transaction().execute(async trx => {
                    const acc_auth = await access_acc_strict(req, res)
                    const acc_target = await db.selectFrom("acc").selectAll().where("acc.id", "=", body.owner).executeTakeFirst()

                    if (!acc_target) {
                        throw eu.error_new_custom(400, cst.ServerError.BadReq)
                    }

                    const auth = await (trx
                        .selectFrom("acc_authemail")
                        .selectAll()
                        .where("id", "=", body.id)
                        .where("owner", "=", body.owner)
                        .executeTakeFirst()
                    )

                    if (!auth) {
                        throw eu.error_new_custom(404, cst.ServerError.NotFound)
                    }

                    // skip the old password part is you are changing the password of a lower access user
                    if (acc_auth.access <= acc_target.access) {
                        // verify old password
                        const password_hash = auth__hash_new(body.verification.password, auth.password_salt)

                        if (!auth__comparator_timesafe(password_hash, auth.password_hash)) {
                            throw eu.error_new_custom(403, cst.ServerError.BadAuth)
                        }
                    }

                    // update to new password
                    if (typeof body.patch.password === "string") {
                        const password_salt = auth__salt_new()
                        const password_hash = auth__hash_new(body.patch.password, password_salt)

                        await (trx
                            .updateTable("acc_authemail")
                            .set({
                                password_hash,
                                password_salt: password_salt,
                            })
                            .where("id", "=", auth.id)
                            .execute()
                        )
                    }
                })

                return eu.response_new_json({ body: null })
            },
        })
    } satisfies Cluster_Route
}
