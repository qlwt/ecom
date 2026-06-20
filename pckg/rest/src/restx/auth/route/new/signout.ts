import * as cst from "@fst/cst"
import * as eu from "@fst/express-utils"
import type { Cluster_Route } from "@src/util/cluster/type/cluster"

export type RestX_AuthRouteNewSignOut_Params = {
}

export const restx_auth_route_new_signout = function(params: RestX_AuthRouteNewSignOut_Params) {
    return {
        schema: {
        },

        handler: eu.route_new_path({
            method: "post",
            path: "/restx/auth/signout",

            middleware: [
                eu.middleware_new_cookie(),
            ],

            handler: async ({ req, res }) => {
                res.clearCookie(cst.CookieName.JWTR, { path: "/restx/auth/signcheck", signed: true })
                res.clearCookie(cst.CookieName.JWTA, { signed: true })

                return eu.response_new_json({
                    body: null,
                    status: 200,
                })
            },
        })
    } satisfies Cluster_Route
}
