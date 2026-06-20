import * as cs from "@fst/config/server"
import * as cst from "@fst/cst"
import * as eu from "@fst/express-utils"
import { env_jwta_duration, env_jwta_secret, env_jwtr_duration, env_jwtr_secret } from "@src/env"
import { auth__hash_new, auth__salt_new } from "@src/restx/auth/util/crypto"
import type { Cluster_Route } from "@src/util/cluster/type/cluster"
import { db } from "@src/db/init"
import { jwt_new_auth } from "@src/util/jwt/new/auth"
import { v7 as uuid } from "uuid"
import * as z from "zod"

type Acc_New_Params = Pick<cs.Database["acc"], "id" | "creation_date" | "status_sessional">

const acc_new = function(params: Acc_New_Params): cs.Database["acc"] {
    return {
        ...params,

        deleted: 0,
        access: cst.AccountAccess.Casual,

        contact_email: "",
        contact_phone: "",
        contact_fname: "",
        contact_lname: "",
        contact_pname: "",
        delivery_division__id: null,
    }
}

export type RestX_AuthRouteNewSignUpEmail_Params = {
}

export const restx_auth_route_new_signup_email = function(params: RestX_AuthRouteNewSignUpEmail_Params) {
    const schema_body = z.object({
        id: z.uuid(),
        email: z.email(),
        password: z.string().max(255),
    }).strict()

    return {
        schema: {
            body: schema_body,
        },

        handler: eu.route_new_path({
            method: "post",
            path: "/restx/auth/signup/email",

            middleware: [
                eu.middleware_new_cookie(),
                eu.middleware_new_json_short(),
            ],

            handler: async ({ req, res }) => {
                const creation_date = Date.now()
                const body = eu.input_parse_zod(schema_body, req.body)

                const trx_res = await db.transaction().execute(async trx => {
                    const auth_id = uuid()
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
                            throw eu.error_new_custom(400, cst.ServerError.BadReq)
                        }
                    }

                    const l_acc = acc_new({
                        id: body.id,
                        creation_date,
                        status_sessional: 0,
                    })

                    // insert acc
                    await (trx
                        .insertInto("acc")
                        .values(l_acc)
                        .executeTakeFirstOrThrow()
                    )

                    // insert auth
                    await (trx
                        .insertInto("acc_authemail")
                        .values({
                            deleted: 0,
                            creation_date,

                            id: auth_id,
                            owner: body.id,

                            email: body.email,

                            password_salt,
                            password_hash,
                        })
                        .executeTakeFirstOrThrow()
                    )

                    res.cookie(
                        cst.CookieName.JWTA,
                        jwt_new_auth(body.id, env_jwta_secret, env_jwta_duration),
                        {
                            signed: true,
                            httpOnly: true,
                            expires: new Date(Date.now() + env_jwta_duration),
                        }
                    )

                    res.cookie(
                        cst.CookieName.JWTR,
                        jwt_new_auth(body.id, env_jwtr_secret, env_jwtr_duration),
                        {
                            signed: true,
                            httpOnly: true,
                            path: "/restx/auth/signcheck",
                            expires: new Date(Date.now() + env_jwtr_duration),
                        }
                    )

                    return {
                        acc: l_acc,
                    }
                })

                return eu.response_new_json({
                    status: 200,
                    body: {
                        acc: trx_res.acc
                    }
                })
            },
        })
    } satisfies Cluster_Route
}
