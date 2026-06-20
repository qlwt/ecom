import * as cst from "@fst/cst"
import * as eu from "@fst/express-utils"
import { db } from "@src/db/init"
import { access_acc_strict } from "@src/util/access/acc_strict"
import type { Cluster_Route } from "@src/util/cluster/type/cluster"
import { sql_new_val_list } from "@src/util/sql/new/val_list"
import * as ksly from "kysely"
import * as z from "zod"

export type RestX_AuthRouteNewDelete_Params = {
}

export const restx_auth_route_new_delete = function(params: RestX_AuthRouteNewDelete_Params) {
    const schema_body = z.object({
        ids: z.array(z.uuid()),
    }).strict()

    return {
        schema: {
            body: schema_body,
        },

        handler: eu.route_new_path({
            method: "delete",
            path: "/restx/auth/delete",

            middleware: [
                eu.middleware_new_cookie(),
                eu.middleware_new_json_short(),
            ],

            handler: async ({ req, res }) => {
                const body = eu.input_parse_zod(schema_body, req.body)

                if (body.ids.length === 0) {
                    return eu.response_new_json({
                        body: null,
                    })
                }

                await db.transaction().execute(async trx => {
                    const acc_auth = await access_acc_strict(req, res)

                    if (acc_auth.access !== cst.AccountAccess.Admin) {
                        const status_forbiden = (await ksly.sql`
                             select
                                 1
                             from acc
                             where (
                                 acc.access >= ${acc_auth.access}
                                 and acc.id in ${sql_new_val_list(body.ids.map(id => ksly.sql`${id}`))}
                                 and acc.id != ${acc_auth.id}
                             )
                         `.execute(trx)).rows[0]

                        if (status_forbiden) {
                            throw eu.error_new_custom(403, cst.ServerError.BadAuth)
                        }
                    }

                    await trx.updateTable("acc").set({ deleted: 1 }).where("id", "in", body.ids).execute()

                    if (body.ids.includes(acc_auth.id)) {
                        res.clearCookie(cst.CookieName.JWTR, { path: "/restx/auth/signcheck", signed: true, })
                        res.clearCookie(cst.CookieName.JWTA, { signed: true, })
                    }
                })

                return eu.response_new_json({
                    status: 200,
                    body: null,
                })
            },
        })
    } satisfies Cluster_Route
}
