import * as cst from "@fst/cst"
import * as eu from "@fst/express-utils"
import { env_jwta_duration, env_jwta_secret, env_jwtr_secret } from "@src/env"
import type { Cluster_Route } from "@src/util/cluster/type/cluster"
import { db } from "@src/db/init"
import { jwt_new_auth } from "@src/util/jwt/new/auth"
import { jwt_schema_data } from "@src/util/jwt/schema/data"
import * as jwt from "jsonwebtoken"
import * as z from "zod"

const schema_cookies = function() {
    return z.object({
        [cst.CookieName.JWTR]: z.string().optional(),
    })
}

type Access_New_Params = {
    readonly token: string
    readonly secret: string
    readonly data: z.infer<typeof jwt_schema_data>
}

const access_new = function(params: Access_New_Params): boolean {
    if (params.data.exp >= Date.now()) {
        return false
    }

    try { jwt.verify(params.token, params.secret) } catch (error) {
        return false
    }

    return true
}

export type RestX_AuthRouteNewSignCheckStrict_Params = {
}

export const restx_auth_route_new_signcheck_strict = function(params: RestX_AuthRouteNewSignCheckStrict_Params) {
    const schema_body = z.object({}).strict()

    return {
        schema: {
            body: schema_body,
        },

        handler: eu.route_new_path({
            method: "post",
            path: "/restx/auth/signcheck/strict",

            middleware: [
                eu.middleware_new_cookie(),
                eu.middleware_new_json_short(),
            ],

            handler: async ({ req, res }) => {
                const cookies = schema_cookies().safeParse(req.signedCookies)

                const trx_res = await db.transaction().execute(async trx => {
                    if (!cookies.success) { return null }

                    const jwt_restore = z.string().safeParse(cookies.data[cst.CookieName.JWTR])

                    if (jwt_restore.success) {
                        const { data: jwt_data } = jwt_schema_data.safeParse(jwt.decode(jwt_restore.data))

                        const status_access = jwt_data && access_new({
                            data: jwt_data,
                            token: jwt_restore.data,
                            secret: env_jwtr_secret,
                        })

                        if (status_access) {
                            const acc = await (trx
                                .selectFrom("acc")
                                .selectAll()
                                .where("id", "=", jwt_data.id)
                                .where("deleted", "=", 0)
                                .executeTakeFirst()
                            )

                            if (!acc) {
                                res.clearCookie(cst.CookieName.JWTR, { path: "/restx/auth/signcheck", signed: true, })
                                res.clearCookie(cst.CookieName.JWTA, { signed: true, })

                                return null
                            }

                            {
                                res.cookie(
                                    cst.CookieName.JWTA,
                                    jwt_new_auth(jwt_data.id, env_jwta_secret, env_jwta_duration),
                                    {
                                        signed: true,
                                        httpOnly: true,
                                        expires: new Date(Date.now() + env_jwta_duration),
                                    }
                                )

                                return {
                                    acc,
                                }
                            }
                        }
                    }

                    res.clearCookie(cst.CookieName.JWTR)
                    res.clearCookie(cst.CookieName.JWTA)

                    return null
                })

                return eu.response_new_json({
                    status: 200,
                    body: trx_res && {
                        acc: trx_res.acc
                    },
                })
            },
        })
    } satisfies Cluster_Route
}
