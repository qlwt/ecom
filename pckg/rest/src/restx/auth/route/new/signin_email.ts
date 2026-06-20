import * as cs from "@fst/config/server"
import * as cst from "@fst/cst"
import * as eu from "@fst/express-utils"
import { env_jwta_duration, env_jwta_secret, env_jwtr_duration, env_jwtr_secret } from "@src/env"
import { auth__comparator_timesafe, auth__hash_new } from "@src/restx/auth/util/crypto"
import type { Cluster_Route } from "@src/util/cluster/type/cluster"
import { db } from "@src/db/init"
import { jwt_new_auth } from "@src/util/jwt/new/auth"
import * as ksly from "kysely"
import * as z from "zod"

export type RestX_AuthRouteNewSignInEmail_Params = {
}

export const restx_auth_route_new_signin_email = function(params: RestX_AuthRouteNewSignInEmail_Params) {
    const schema_body = z.object({
        email: z.email(),
        password: z.string().max(255),
    }).strict()

    return {
        schema: {
            body: schema_body,
        },

        handler: eu.route_new_path({
            method: "post",
            path: "/restx/auth/signin/email",

            middleware: [
                eu.middleware_new_cookie(),
                eu.middleware_new_json_short(),
            ],

            handler: async ({ req, res }) => {
                const body = eu.input_parse_zod(schema_body, req.body)

                const trx_res = await db.transaction().execute(async trx => {
                    const auth_list = (await (ksly.sql<cs.Database["acc_authemail"]>`
                        select
                            acc_authemail.*
                        from acc_authemail
                        where (
                            acc_authemail.email = ${body.email}
                            and acc_authemail.deleted = 0
                            and EXISTS (
                                select
                                1
                                from acc
                                where (
                                    acc.deleted = 0
                                    and acc.id = acc_authemail.owner
                                )
                           )
                        )
                    `.execute(trx))).rows

                    if (auth_list.length <= 0) {
                        throw eu.error_new_custom(400, cst.ServerError.BadReq)
                    }

                    for (const auth of auth_list) {
                        const password_hash = auth__hash_new(body.password, auth.password_salt)

                        if (auth__comparator_timesafe(password_hash, auth.password_hash)) {
                            const acc = (await (ksly.sql<cs.Database["acc"]>`
                                select
                                    acc.*
                                from acc
                                where (
                                    acc.deleted = 0
                                    and acc.id = ${auth.owner}
                                )
                                limit 1
                            `).execute(trx)).rows[0]

                            if (!acc) {
                                throw eu.error_new_custom(403, cst.ServerError.BadAuth)
                            }

                            res.cookie(
                                cst.CookieName.JWTA,
                                jwt_new_auth(acc.id, env_jwta_secret, env_jwta_duration),
                                {
                                    signed: true,
                                    httpOnly: true,
                                    expires: new Date(Date.now() + env_jwta_duration),
                                }
                            )

                            res.cookie(
                                cst.CookieName.JWTR,
                                jwt_new_auth(acc.id, env_jwtr_secret, env_jwtr_duration),
                                {
                                    signed: true,
                                    httpOnly: true,
                                    path: "/restx/auth/signcheck",
                                    expires: new Date(Date.now() + env_jwtr_duration),
                                }
                            )

                            return {
                                acc,
                            }
                        }
                    }

                    throw eu.error_new_custom(403, cst.ServerError.BadAuth)
                })

                return eu.response_new_json({
                    status: 200,
                    body: {
                        acc: trx_res.acc,
                    }
                })
            },
        })
    } satisfies Cluster_Route
}
