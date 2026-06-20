import * as cs from "@fst/config/server"
import * as cst from "@fst/cst"
import * as eu from "@fst/express-utils"
import type { RestRoutes_Config, RestRoutes_DataPostResult } from "@src/rest/type/config"
import { access_acc } from "@src/util/access/acc"
import { db } from "@src/db/init"
import { promise_waitfor } from "@src/util/promise/waitfor"
import { zod_field_rec_post } from "@src/util/zod/field_rec_post"
import * as express from "express"
import * as ksly from "kysely"
import * as z from "zod"

const schema_new_post = function(table: cs.TablePublicData) {
    const joins: Record<string, z.ZodType> = {}

    for (const [join_key, join] of Object.entries(table.joins.core)) {
        const target_table = cs.def.table_public[join.target_table as keyof typeof cs.def.table_public]

        if (target_table.kind === "data") {
            if (join.kind === "forwards") {
                joins[join_key] = schema_new_post(target_table).unwrap().nullable().exactOptional()
            } else {
                joins[join_key] = schema_new_post(target_table).nullable().exactOptional()
            }
        }
    }

    return z.array(z.object({
        core: zod_field_rec_post(table.fields),
        joins: z.object(joins),
    }))
}

type Post_Params = {
    readonly req: express.Request
    readonly res: express.Response
    readonly trx: ksly.Transaction<cs.Database>

    readonly creation_date: number
    readonly acc: cs.Database["acc"] | null

    readonly config: RestRoutes_Config
    readonly table_name: keyof cs.Rest

    readonly body: z.infer<ReturnType<typeof schema_new_post>>
}

const post = async function(params: Post_Params) {
    if (params.body.length === 0) { return }

    const table_config = params.config[params.table_name]
    const table_def = cs.def.table_public[params.table_name]

    if (!await promise_waitfor(table_config.post.access_skip?.(params.body as any))) {
        const checks = await promise_waitfor(table_config.post.access_check?.(params.body as any))

        if (checks && checks.length >= 1) {
            const account = params.acc

            if (account === null) {
                throw eu.error_new_custom(401, cst.ServerError.NoAuth)
            }

            const results = await Promise.all(checks.map(check => check(account)))

            if (!results.every(n => n)) {
                throw eu.error_new_custom(403, cst.ServerError.BadAuth)
            }
        }
    }

    const insertions_forwards = new Array<() => Promise<void>>()
    const indestions_backwards = new Array<() => Promise<void>>()

    for (const [join_key, join] of Object.entries(table_def.joins.core)) {
        if (join.kind === "forwards") {
            insertions_forwards.push(() => {
                return post({
                    trx: params.trx,
                    req: params.req,
                    res: params.res,
                    config: params.config,
                    acc: params.acc,
                    creation_date: params.creation_date,

                    table_name: join.target_table as keyof cs.Rest,
                    body: params.body.map(node => node.joins[join_key]).filter(n => n !== undefined) as any,
                })
            })
        } else {
            indestions_backwards.push(() => {
                return post({
                    trx: params.trx,
                    req: params.req,
                    res: params.res,
                    config: params.config,
                    acc: params.acc,
                    creation_date: params.creation_date,

                    table_name: join.target_table as keyof cs.Rest,
                    body: params.body.map(node => node.joins[join_key]).filter(n => n !== undefined).flat() as any,
                })
            })
        }
    }

    await Promise.all(insertions_forwards.map(cb => cb()))

    await (params.trx
        .insertInto(params.table_name as keyof cs.Database)
        .values(await Promise.all(
            params.body.map(node_raw => {
                return table_config.post!.node_convert(
                    node_raw.core as any,
                    { creation_date: params.creation_date, }
                )
            })
        ))
        .execute()
    )

    await Promise.all(indestions_backwards.map(cb => cb()))
}

export type RestRoutes_RouteNewDataPost_Params = {
    readonly config: RestRoutes_Config
    readonly table: cs.TablePublicData
    readonly table_name: keyof cs.RestData
    readonly restdef_post: cs.RestDefData_PostStd
}

export const rest_route_new_data_post = function(params: RestRoutes_RouteNewDataPost_Params) {
    const schema_body = schema_new_post(params.table)

    return {
        schema: {
            body: schema_body,
        },

        handler: eu.route_new_path<RestRoutes_DataPostResult>({
            method: "post",
            path: `/rest/${params.table_name}`,

            middleware: [
                eu.middleware_new_cookie(),
                eu.middleware_new_url_short(),
                eu.middleware_new_json_long(),
            ],

            handler: async ({ req, res, }) => {
                const creation_date = Date.now()
                const body = eu.input_parse_zod(schema_body, req.body)

                await db.transaction().execute(async trx => {
                    await post({
                        trx,
                        req,
                        res,

                        creation_date,
                        acc: (await access_acc(req, res)),

                        config: params.config,
                        table_name: params.table_name,

                        body,
                    })
                })

                return eu.response_new_json({ body: { creation_date, }, })
            },
        })
    }
}
