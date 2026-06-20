import * as cs from "@fst/config/server"
import { rest_route_new_data_delete } from "@src/rest/route/new/data_delete"
import { rest_route_new_data_get } from "@src/rest/route/new/data_get"
import { rest_route_new_data_patch } from "@src/rest/route/new/data_patch"
import { rest_route_new_data_post } from "@src/rest/route/new/data_post"
import { rest_route_new_img_delete } from "@src/rest/route/new/img_delete"
import { rest_route_new_img_get } from "@src/rest/route/new/img_get"
import { rest_route_new_img_post } from "@src/rest/route/new/img_post"
import type { RestRoutes_Config } from "@src/rest/type/config"
import type { RestRoutes_Result } from "@src/rest/type/result"
import { object_new_map } from "@src/util/object/new/map"

export const rest_new = function(config: RestRoutes_Config): RestRoutes_Result {
    return object_new_map(cs.def.table_public, (table, table_name) => {
        if (table.kind === "data") {
            return {
                routes: {
                    get: rest_route_new_data_get({
                        table,
                        config,
                        restdef_get: table.rest.get,
                        table_name: table_name as Extract<typeof table_name, keyof cs.RestData>,
                    }),

                    patch: rest_route_new_data_patch({
                        table,
                        config,
                        restdef_patch: table.rest.patch,
                        table_name: table_name as Extract<typeof table_name, keyof cs.RestData>,
                    }),

                    delete: rest_route_new_data_delete({
                        table,
                        config,
                        restdef_delete: table.rest.delete,
                        table_name: table_name as Extract<typeof table_name, keyof cs.RestData>,
                    }),

                    post: rest_route_new_data_post({
                        table,
                        config,
                        restdef_post: table.rest.post,
                        table_name: table_name as Extract<typeof table_name, keyof cs.RestData>,
                    }),
                },
            }
        } else if (table.kind === "img") {
            return {
                routes: {
                    get: rest_route_new_img_get({
                        table,
                        config,
                        restdef_get: table.rest.get,
                        table_name: table_name as Extract<typeof table_name, keyof cs.RestImg>,
                    }),

                    delete: rest_route_new_img_delete({
                        table,
                        config,
                        restdef_delete: table.rest.delete,
                        table_name: table_name as Extract<typeof table_name, keyof cs.RestImg>,
                    }),

                    post: rest_route_new_img_post({
                        table,
                        config,
                        restdef_post: table.rest.post,
                        table_name: table_name as Extract<typeof table_name, keyof cs.RestImg>,
                    }),
                },
            }
        }

        throw new Error(`Unexpected table.kind ${(table as any).kind}`)
    }) as any as RestRoutes_Result
}
