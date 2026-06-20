import * as cs from "@fst/config/server"
import * as cst from "@fst/cst"
import * as eu from "@fst/express-utils"
import { access_acc_strict } from "@src/util/access/acc_strict"
import type { Cluster_Route } from "@src/util/cluster/type/cluster"
import { db } from "@src/db/init"
import { promise_waitfor } from "@src/util/promise/waitfor"
import type { RestRoutes_Config, RestRoutes_DataDeleteResult } from "@src/rest/type/config"
import * as z from "zod"

export type RestRoutes_RouteNewDataDelete_Params = {
    readonly config: RestRoutes_Config
    readonly table: cs.TablePublicData
    readonly table_name: keyof cs.RestData
    readonly restdef_delete: cs.RestDefData_DeleteStd
}

export const rest_route_new_data_delete = function(params: RestRoutes_RouteNewDataDelete_Params) {
    const schema_body = z.object({
        ids: z.array(z.uuid()),
    })

    return {
        schema: {
            body: schema_body,
        },

        handler: eu.route_new_path<RestRoutes_DataDeleteResult>({
            path: `/rest/${params.table_name}`,
            method: "delete",

            middleware: [
                eu.middleware_new_cookie(),
                eu.middleware_new_url_short(),
                eu.middleware_new_json_short(),
            ],

            handler: async ({ req, res, }) => {
                const body = eu.input_parse_zod(schema_body, req.body)

                if (!await promise_waitfor(params.config[params.table_name].delete?.access_skip?.(body as any))) {
                    const checks = await promise_waitfor(params.config[params.table_name].delete?.access_check?.(body as any))

                    if (checks && checks.length >= 1) {
                        const acc = await access_acc_strict(req, res)
                        const results = await Promise.all(checks.map(check => check(acc)))

                        if (!results.every(n => n)) {
                            throw eu.error_new_custom(403, cst.ServerError.BadAuth)
                        }
                    }
                }

                // authhorized
                await db.transaction().execute(async trx => {
                    await (trx
                        .updateTable(params.table_name)
                        .set({ deleted: 1, })
                        .where("id", "in", body.ids)
                        .execute()
                    )
                })

                return eu.response_new_json({ body: null, })
            },
        })
    } satisfies Cluster_Route
}
