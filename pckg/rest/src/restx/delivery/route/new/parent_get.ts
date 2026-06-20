import * as eu from "@fst/express-utils"
import type { Cluster_Route } from "@src/util/cluster/type/cluster"
import { db } from "@src/db/init"
import { sql_new_fseq_and } from "@src/util/sql/new/fseq_and"
import { zod_json } from "@src/util/zod/json"
import * as ksly from "kysely"
import * as z from "zod"

export type RestX_DeliveryRouteNewParentGet_Params = {
}

export const restx_delivery_route_new_parent_get = function(params: RestX_DeliveryRouteNewParentGet_Params) {
    const schema_query = z.object({
        country__code: zod_json().pipe(z.string().max(3)),
    })

    return {
        schema: {
            query: schema_query,
        },

        handler: eu.route_new_path({
            method: "get",
            path: `/restx/delivery/parent`,

            middleware: [
                eu.middleware_new_cookie(),
                eu.middleware_new_url_short(),
                eu.middleware_new_gzip_normal()
            ],

            handler: async ctx => {
                const { req, } = ctx

                const query = eu.input_parse_zod(schema_query, req.query)

                const result = await db.transaction().execute(async trx => {
                    const sqlq_fseq = sql_new_fseq_and([
                        ksly.sql`delivery_division.deleted = 0`,
                        ksly.sql`delivery_division.status_text = 'Working'`,
                        ksly.sql`delivery_division.status_available = 1`,
                        ksly.sql`delivery_division.country_code = ${query.country__code}`,
                    ])

                    const search = (await (ksly.sql<{ name: string, numid: number, country__code: string }>`
                        select distinct on (numid)
                            delivery_division.creation_date as date,
                            delivery_division.parent_name as name,
                            delivery_division.parent_numid as numid,
                            delivery_division.country_code as country__code
                        from delivery_division 
                        where ${sqlq_fseq}
                        order by numid
                    `.execute(trx))).rows

                    return {
                        search,
                    }
                })

                return eu.response_new_json({
                    body: {
                        nodes: result.search,
                    },
                })
            },
        }),
    } satisfies Cluster_Route
}
