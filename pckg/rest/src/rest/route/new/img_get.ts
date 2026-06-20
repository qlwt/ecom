import * as cs from "@fst/config/server"
import * as cst from "@fst/cst"
import * as eu from "@fst/express-utils"
import type { RestRoutes_Config, RestRoutes_ImgGetResult } from "@src/rest/type/config"
import { access_acc_strict } from "@src/util/access/acc_strict"
import type { Cluster_Route } from "@src/util/cluster/type/cluster"
import { db } from "@src/db/init"
import { promise_waitfor } from "@src/util/promise/waitfor"
import { sql_new_fseq_and } from "@src/util/sql/new/fseq_and"
import { zod_ftype_query } from "@src/util/zod/ftype_query"
import * as ksly from "kysely"
import * as fs from "node:fs/promises"
import * as path from "node:path"

export type RestRoutes_RouteNewImgGet_Params = {
    readonly config: RestRoutes_Config
    readonly table: cs.TablePublicImg
    readonly table_name: keyof cs.RestImg
    readonly restdef_get: cs.RestDefImg_GetStd
}

export const rest_route_new_img_get = function(params: RestRoutes_RouteNewImgGet_Params) {
    const schema_query = zod_ftype_query(params.restdef_get.query)

    return {
        schema: {
            query: schema_query,
        },

        handler: eu.route_new_path<RestRoutes_ImgGetResult>({
            method: "get",
            path: `/rest/${params.table_name}`,

            middleware: [
                eu.middleware_new_cookie(),
                eu.middleware_new_url_short(),
            ],

            handler: async ctx => {
                const { req, res } = ctx
                const query = eu.input_parse_zod(schema_query, req.query)

                if (!await promise_waitfor(params.config[params.table_name].get.access_skip?.(query as any))) {
                    const checks = await promise_waitfor(params.config[params.table_name].get.access_check?.(query as any))

                    if (checks && checks.length >= 1) {
                        const acc = await access_acc_strict(req, res)
                        const results = await Promise.all(checks.map(check => check(acc)))

                        if (!results.every(n => n)) {
                            throw eu.error_new_custom(403, cst.ServerError.BadAuth)
                        }
                    }
                }

                const query_area = await params.config[params.table_name].get.area_new(query as any)
                const query_fseq = await params.config[params.table_name].get.fseq_new(query as any)

                const result = await db.transaction().execute(async trx => {
                    const sqlr_variants = (await ksly.sql`
                        select
                            ${ksly.sql.raw(params.table.table_variant)}.*
                        from ${ksly.sql.raw(params.table_name)}
                        left join 
                            ${ksly.sql.raw(params.table.table_variant)} on (
                                ${ksly.sql.raw(params.table.table_variant)}.${ksly.sql.raw(params.table_name)}__id
                                =
                                ${ksly.sql.raw(params.table_name)}.id
                            )
                        where ${sql_new_fseq_and([query_fseq, ksly.sql.raw(`${params.table_name}.deleted = 0`)])}
                        order by ${ksly.sql.raw(params.table.table_variant)}.area asc
                    `.execute(trx)).rows as cs.Database["img_variant"][]

                    if (sqlr_variants.length <= 0) {
                        throw eu.error_new_custom(404, cst.ServerError.NotFound)
                    }

                    for (const variant of sqlr_variants) {
                        if (variant.area >= query_area) {
                            return variant
                        }
                    }

                    return sqlr_variants.at(-1)!
                })

                const file = await fs.readFile(path.resolve(`./storage/${result.filename}`))

                return eu.response_new_custom({
                    body: file,
                    status: 200,

                    headers: {
                        "Content-Type": result.mimetype,
                    },
                })
            },
        })
    } satisfies Cluster_Route
}
