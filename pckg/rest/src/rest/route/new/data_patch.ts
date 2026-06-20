import * as cs from "@fst/config/server"
import * as cst from "@fst/cst"
import * as eu from "@fst/express-utils"
import { access_acc_strict } from "@src/util/access/acc_strict"
import type { Cluster_Route } from "@src/util/cluster/type/cluster"
import { db } from "@src/db/init"
import { promise_waitfor } from "@src/util/promise/waitfor"
import type { RestRoutes_Config, RestRoutes_DataPatchResult } from "@src/rest/type/config"
import { zod_field_rec_patch } from "@src/util/zod/field_rec_patch"
import * as z from "zod"

export type RestRoutes_RouteNewDataPatch_Params = {
    readonly config: RestRoutes_Config
    readonly table: cs.TablePublicData
    readonly table_name: keyof cs.RestData
    readonly restdef_patch: cs.RestDefData_PatchStd
}

export const rest_route_new_data_patch = function(params: RestRoutes_RouteNewDataPatch_Params) {
    const schema_body = z.object({
        id: z.uuid(),
        patch: zod_field_rec_patch(params.table.fields),
    })

    return {
        schema: {
            body: schema_body,
        },

        handler: eu.route_new_path<RestRoutes_DataPatchResult>({
            path: `/rest/${params.table_name}`,
            method: "patch",

            middleware: [
                eu.middleware_new_cookie(),
                eu.middleware_new_url_short(),
                eu.middleware_new_json_short(),
            ],

            handler: async ({ req, res, }) => {
                const body = eu.input_parse_zod(schema_body, req.body)

                if (!await promise_waitfor(params.config[params.table_name].patch?.access_skip?.(body as any))) {
                    const checks = await promise_waitfor(params.config[params.table_name].patch?.access_check?.(body as any))

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
                        .set(body.patch)
                        .where("id", "=", body.id)
                        .execute()
                    )
                })

                return eu.response_new_json({ body: null, })
            },
        })
    } satisfies Cluster_Route
}
