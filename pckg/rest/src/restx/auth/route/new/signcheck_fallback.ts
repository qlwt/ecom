import * as cs from "@fst/config/server"
import * as cst from "@fst/cst"
import * as eu from "@fst/express-utils"
import { env_jwta_duration, env_jwta_secret, env_jwtr_duration, env_jwtr_secret } from "@src/env"
import type { Cluster_Route } from "@src/util/cluster/type/cluster"
import { db } from "@src/db/init"
import { jwt_new_auth } from "@src/util/jwt/new/auth"
import { jwt_schema_data } from "@src/util/jwt/schema/data"
import * as jwt from "jsonwebtoken"
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

export type RestX_AuthRouteNewSignCheckFallback_Params = {
}

export const restx_auth_route_new_signcheck_fallback = function(params: RestX_AuthRouteNewSignCheckFallback_Params) {
    const schema_body = z.object({
        fallback_id: z.uuid(),
    }).strict()

    return {
        schema: {
            body: schema_body,
        },

        handler: eu.route_new_path({
            method: "post",
            path: "/restx/auth/signcheck/fallback",

            middleware: [
                eu.middleware_new_cookie(),
                eu.middleware_new_json_short(),
            ],

            handler: async ({ req, res }) => {
                const creation_date = Date.now()
                const cookies = schema_cookies().safeParse(req.signedCookies)
                const body = eu.input_parse_zod(schema_body, req.body)

                const trx_res = await db.transaction().execute(async trx => {
                    if (cookies.success) {
                        const jwt_restore = z.string().safeParse(cookies.data[cst.CookieName.JWTR])

                        if (jwt_restore.success) {
                            const { data: jwt_data } = jwt_schema_data.safeParse(jwt.decode(jwt_restore.data))

                            const access = jwt_data && access_new({
                                data: jwt_data,
                                token: jwt_restore.data,
                                secret: env_jwtr_secret,
                            })

                            if (access) {
                                const l_acc = await (trx
                                    .selectFrom("acc")
                                    .selectAll()
                                    .where("id", "=", jwt_data.id)
                                    .where("deleted", "=", 0)
                                    .executeTakeFirst()
                                )

                                if (l_acc) {
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
                                        acc: l_acc,
                                    }
                                }
                            }
                        }
                    }

                    {
                        const l_acc = acc_new({
                            creation_date,
                            status_sessional: 1,
                            id: body.fallback_id,
                        })

                        await (trx
                            .insertInto("acc")
                            .values(l_acc)
                            .executeTakeFirstOrThrow()
                        )

                        res.cookie(
                            cst.CookieName.JWTA,
                            jwt_new_auth(body.fallback_id, env_jwta_secret, env_jwta_duration),
                            {
                                signed: true,
                                httpOnly: true,
                                expires: new Date(Date.now() + env_jwta_duration),
                            }
                        )

                        res.cookie(
                            cst.CookieName.JWTR,
                            jwt_new_auth(body.fallback_id, env_jwtr_secret, env_jwtr_duration),
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
                    }
                })

                return eu.response_new_json({
                    status: 200,
                    body: {
                        acc: trx_res.acc,
                    },
                })
            },
        })
    } satisfies Cluster_Route
}
