import * as cs from "@fst/config/server"
import * as cst from "@fst/cst"
import * as eu from "@fst/express-utils"
import type { RestRoutes_Config, RestRoutes_DataGetResult } from "@src/rest/type/config"
import { access_acc_strict } from "@src/util/access/acc_strict"
import type { Cluster_Route } from "@src/util/cluster/type/cluster"
import { db } from "@src/db/init"
import type { Database_Slice } from "@src/db/type/dbslice"
import { object_new_map } from "@src/util/object/new/map"
import { promise_waitfor } from "@src/util/promise/waitfor"
import { sql_new_cte } from "@src/util/sql/new/cte"
import { sql_new_fields } from "@src/util/sql/new/fields"
import { sql_new_filter } from "@src/util/sql/new/filter"
import { sql_new_fseq_and } from "@src/util/sql/new/fseq_and"
import { sql_new_tables } from "@src/util/sql/new/tables"
import { sql_new_unions } from "@src/util/sql/new/unions"
import { sqlrel_normalize } from "@src/util/sql/rel/normalize"
import type { Sql_Relation } from "@src/util/sql/type/relation"
import { zod_ftype_query } from "@src/util/zod/ftype_query"
import * as ksly from "kysely"

const sql_new_columns = function(table_name: string, columns: readonly string[]) {
    if (columns.length === 0) {
        throw new Error(`empty selection for ${table_name}`)
    }

    return columns.reduce<ksly.RawBuilder<unknown> | null>(
        (acc, node) => {
            const node_sql = ksly.sql`${ksly.sql.raw(table_name)}.${ksly.sql.raw(node)}`

            if (acc === null) {
                return node_sql
            }

            return ksly.sql`${acc}, ${node_sql}`
        },
        null
    )!

}

export type Sql_NewReqGet_Params<TName extends keyof cs.Rest> = {
    readonly tname: TName
    readonly columns_new: (params: Columns_New_Params) => readonly string[]

    readonly status_privileged: boolean
    readonly relations: readonly Sql_Relation[]

    readonly limit: number | null
    readonly fseq_main: ksly.RawBuilder<unknown> | null
    readonly fseq_new_child: (tname: keyof cs.Rest) => Promise<ksly.RawBuilder<unknown> | null>
}

export const sql_new_req_get = async function <TName extends keyof cs.Rest>(params: Sql_NewReqGet_Params<TName>) {
    const sqlq_filter_main = sql_new_filter([
        ksly.sql`${ksly.sql.raw(params.tname)}.deleted = 0`,

        params.fseq_main,
    ])

    const sqlq_cte = sql_new_cte([
        ksly.sql`s_${ksly.sql.raw(params.tname)} as (
            select distinct
                ${sql_new_columns(params.tname, params.columns_new({ table_name: params.tname, }))}
            from ${ksly.sql.raw(params.tname)}
            ${sqlq_filter_main}
            order by ${ksly.sql.raw(params.tname)}.id desc
            limit ${params.limit ?? Number.MAX_SAFE_INTEGER}
        )`,

        ...(await Promise.all(params.relations.map(async rel => {
            if (rel.join_condition.length === 0) {
                return []
            }

            const fseq_child = await params.fseq_new_child(rel.name as keyof cs.Rest,)

            if (rel.join_condition.length === 1) {
                const condition = rel.join_condition[0]!

                const sqlq_filter_cond = sql_new_filter([
                    ksly.sql`
                        ${ksly.sql.raw(rel.name)}.${ksly.sql.raw(condition.self_field)} 
                        ${ksly.sql.raw(condition.operator)} 
                        ${ksly.sql.raw(`s_${condition.relation_name}`)}.${ksly.sql.raw(condition.relation_field)}
                    `,

                    ksly.sql`${ksly.sql.raw(rel.name)}.deleted = 0`,

                    fseq_child,
                ])

                return [ksly.sql`s_${ksly.sql.raw(rel.name)} as (
                    select distinct
                        ${sql_new_columns(rel.name, params.columns_new({ table_name: rel.name as any, }))}
                    from ${ksly.sql.raw(rel.name)}, s_${ksly.sql.raw(rel.join_condition[0]!.relation_name)}
                    ${sqlq_filter_cond}
                )`]
            }

            {
                const ctes_conditions = rel.join_condition.map((condition, i) => {
                    const sqlq_filter_cond = sql_new_filter([
                        ksly.sql`
                            ${ksly.sql.raw(rel.name)}.${ksly.sql.raw(condition.self_field)} 
                            ${ksly.sql.raw(condition.operator)} 
                            ${ksly.sql.raw(`s_${condition.relation_name}`)}.${ksly.sql.raw(condition.relation_field)}
                        `,

                        ksly.sql`${ksly.sql.raw(rel.name)}.deleted = 0`,

                        fseq_child,
                    ])

                    return ksly.sql`t_${ksly.sql.raw(rel.name)}_${ksly.sql.raw(i.toString())} as (
                        select distinct
                            ${sql_new_columns(rel.name, params.columns_new({ table_name: rel.name as any, }))}
                        from ${ksly.sql.raw(rel.name)}, s_${ksly.sql.raw(condition.relation_name)}
                        ${sqlq_filter_cond}
                    )`
                })

                const ctes_parts = rel.join_condition.map((_condition, i) => {
                    return ksly.sql`select * from t_${ksly.sql.raw(rel.name)}_${ksly.sql.raw(i.toString())}`
                })

                const cte_final = ksly.sql`s_${ksly.sql.raw(rel.name)} as (
                    ${sql_new_unions(ctes_parts)}
                )`

                return [
                    ...ctes_conditions,

                    cte_final,
                ]
            }
        }))).flat(),

        ksly.sql`j_${ksly.sql.raw(params.tname)} as (
            select 
                json_agg(s_${ksly.sql.raw(params.tname)}.*) as data
            from s_${ksly.sql.raw(params.tname)}
        )`,

        ...params.relations.map(rel => {
            return ksly.sql`j_${ksly.sql.raw(rel.name)} as (
                select 
                    json_agg(s_${ksly.sql.raw(rel.name)}.*) as data
                from s_${ksly.sql.raw(rel.name)}
            )`
        }),
    ])

    const sqlq_jtables = sql_new_tables([
        ksly.sql`j_${ksly.sql.raw(params.tname)}`,

        ...params.relations.map(rel => {
            return ksly.sql`j_${ksly.sql.raw(rel.name)}`
        })
    ])

    const sqlq_fields = sql_new_fields([
        ksly.sql`'${ksly.sql.raw(params.tname)}', j_${ksly.sql.raw(params.tname)}.data`,

        ...params.relations.map(rel => {
            return ksly.sql`'${ksly.sql.raw(rel.name)}', j_${ksly.sql.raw(rel.name)}.data`
        })
    ])

    return ksly.sql`
        with ${sqlq_cte} select
            json_build_object(
                ${sqlq_fields}
            ) as data
        from ${sqlq_jtables}
    `
}

type Relations_New_Params = {
    readonly table_name: keyof cs.Rest
    readonly table: cs.TablePublicData
}

const relations_new = function(params: Relations_New_Params): Sql_Relation[] {
    const result = new Array<Sql_Relation>()

    const stack: [keyof cs.Rest, cs.Join[]][] = [
        [params.table_name, Object.values(params.table.joins.core)]
    ]

    while (stack.length) {
        const [table_name, joins] = stack.pop()!

        for (const join of joins) {
            result.push({
                name: join.target_table as any,

                join_condition: [{
                    operator: "=",
                    self_field: join.target_field,

                    relation_name: table_name as any,
                    relation_field: join.self_field,
                }]
            })

            stack.push([
                join.target_table as any,
                Object.values(
                    cs.def.table_public[join.target_table as keyof cs.Rest].joins.core
                )
            ])
        }
    }

    return sqlrel_normalize(result)
}

type Columns_New_Params = {
    readonly table_name: keyof cs.Rest
}

const columns_new = function(params: Columns_New_Params): string[] {
    const columns = new Array<string>()
    const table = cs.def.table_public[params.table_name]

    for (const [field_name, field] of Object.entries(table.fields)) {
        if (!field.status_private) {
            columns.push(field_name)
        }
    }

    return columns
}

export type RestRoutes_RouteNewDataGet_Params = {
    readonly config: RestRoutes_Config
    readonly table: cs.TablePublicData
    readonly table_name: keyof cs.RestData
    readonly restdef_get: cs.RestDefData_GetStd
}

export const rest_route_new_data_get = function(params: RestRoutes_RouteNewDataGet_Params) {
    const schema_query = zod_ftype_query(params.restdef_get.query)

    return {
        schema: {
            query: schema_query,
        },

        handler: eu.route_new_path<RestRoutes_DataGetResult>({
            path: `/rest/${params.table_name}`,
            method: "get",

            middleware: [
                eu.middleware_new_cookie(),
                eu.middleware_new_url_short(),
            ],

            handler: async ctx => {
                const { req, res } = ctx

                const query = eu.input_parse_zod(schema_query, req.query)

                const status_privileged = (await promise_waitfor(
                    params.config[params.table_name].get.access_skip?.(query as any)
                )) ?? false

                if (!status_privileged) {
                    const checks = await promise_waitfor(params.config[params.table_name].get.access_check?.(query as any))

                    if (checks && checks.length >= 1) {
                        const acc = await access_acc_strict(req, res)
                        const results = await Promise.all(checks.map(check => check(acc)))

                        if (!results.every(n => n)) {
                            throw eu.error_new_custom(403, cst.ServerError.BadAuth)
                        }
                    }
                }

                // authhorized
                const result = await db.transaction().execute(async trx => {
                    const relations = relations_new({ table: params.table, table_name: params.table_name, })
                    const fseq = await params.config[params.table_name].get.fseq_new(query as any)
                    const limit = await params.config[params.table_name].get.limit_new(query as any)

                    const sql = (await sql_new_req_get({
                        tname: params.table_name,
                        status_privileged: status_privileged,

                        limit,
                        relations,
                        columns_new,
                        fseq_main: fseq,

                        fseq_new_child: tname_child => params.config[tname_child].get.fseq_new_child({
                            table: params.table_name,
                            query: query as any,
                        } as any),
                    }))

                    let sqlres = (await sql.execute(trx)).rows

                    const cursor = (await (ksly.sql<{ id: string }>`
                        select
                            *
                        from ${ksly.sql.raw(params.table_name)}
                        where ${sql_new_fseq_and([fseq, ksly.sql.raw(`${params.table_name}.deleted = 0`)])}
                        order by ${ksly.sql.raw(params.table_name)}.id desc
                        limit 1
                        offset ${query.limit}
                    `.execute(trx))).rows[0]

                    const count = (await (ksly.sql<{ count: number }>`
                        select
                            COUNT(*) as count
                        from ${ksly.sql.raw(params.table_name)}
                        where ${sql_new_fseq_and([fseq, ksly.sql.raw(`${params.table_name}.deleted = 0`)])}
                    `.execute(trx))).rows[0]!

                    return {
                        count_total: count.count as number,
                        cursor: cursor ? cursor.id as string : null,

                        slice: object_new_map(
                            (sqlres as [{ data: Record<string, {}[] | null> }])[0].data,
                            (table_nodes, table_key) => {
                                if (table_nodes === null) {
                                    return null
                                }

                                return {
                                    nodes: table_nodes,
                                    status_indexed: table_key === params.table_name,
                                } as const
                            }
                        ) as Database_Slice
                    }
                })

                return eu.response_new_json({
                    body: result
                })
            },
        })
    } satisfies Cluster_Route
}
