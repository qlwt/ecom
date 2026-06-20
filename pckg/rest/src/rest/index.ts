import * as cs from "@fst/config/server";
import * as cst from "@fst/cst";
import * as eu from "@fst/express-utils";
import * as sxs from "@fst/syntax-search";
import { rest_new } from "@src/rest/new";
import type { RestRoutes_AccessCheck, RestRoutes_Config, RestRoutes_DataConfig_PostNodeConvertConfig, RestRoutes_ParentQuery } from "@src/rest/type/config";
import { db } from "@src/db/init";
import { sql_new_fseq_and } from "@src/util/sql/new/fseq_and";
import { sql_new_fseq_or } from "@src/util/sql/new/fseq_or";
import { sql_new_val_list } from "@src/util/sql/new/val_list";
import * as ksly from "kysely";
import { v7 as uuid } from "uuid";

type QueryOwnable = {
    readonly pick_owner: ("null-public" | "null-private" | string)[] | null
}

type QueryHidable = {
    readonly include_hidden: 0 | 1 | null
}

type QueryStd = {
    readonly limit: number | null
    readonly cursor: string | null
    readonly include_hidden?: 0 | 1 | null
    readonly pick_owner?: ("null-public" | "null-private" | string)[] | null
}

type BodyPatch<Patch extends {} = {}> = {
    readonly id: string
    readonly patch: Patch
}

type BodyDelete = {
    readonly ids: string[]
}

type BodyPostStd = {
    readonly core: {}
}[]

type BodyPostHidable = {
    readonly core: {
        readonly status_hidden: 0 | 1
    }
}[]

type BodyPostOwnable = {
    readonly core: {
        readonly owner: string | null
    }
}[]

const accesscheck_ismod = async function(acc: cs.Database["acc"]): Promise<boolean> {
    return acc.access >= cst.AccountAccess.Moderator
}

type ConfigDataExtension<Query extends {}, G_BodyPost extends { readonly core: {} }[]> = {
    readonly get: {
        readonly limit_new?: {
            (query: Query): Promise<number | null>
        }

        readonly access_skip?: {
            (query: Query): Promise<boolean>
        }

        readonly access_check?: {
            (query: Query): Promise<readonly RestRoutes_AccessCheck[]>
        }

        readonly fseq_new?: {
            (query: Query): Promise<ksly.RawBuilder<unknown> | null>
        }

        readonly fseq_new_child?: {
            (query: RestRoutes_ParentQuery): Promise<ksly.RawBuilder<unknown> | null>
        },
    }

    readonly post: {
        readonly access_skip?: {
            (body: G_BodyPost): Promise<boolean>
        }

        readonly access_check?: {
            (body: G_BodyPost): Promise<readonly RestRoutes_AccessCheck[]>
        }

        readonly node_convert?: {
            (input: G_BodyPost[number]["core"], config: RestRoutes_DataConfig_PostNodeConvertConfig): Promise<{}>
        }
    }

    readonly patch: {
        readonly access_skip?: {
            (body: BodyPatch): Promise<boolean>
        }

        readonly access_check?: {
            (body: BodyPatch): Promise<readonly RestRoutes_AccessCheck[]>
        }
    }

    readonly delete: {
        readonly access_skip?: {
            (body: BodyDelete): Promise<boolean>
        }

        readonly access_check?: {
            (body: BodyDelete): Promise<readonly RestRoutes_AccessCheck[]>
        }
    }
}

type ConfigDataExtension_ByTName<TName extends keyof cs.RestData> = (
    ConfigDataExtension<cs.RestData[TName]["get"]["query"], cs.RestData[TName]["post"]["body"]>
)

type ConfigDataExtension_Factory<TName extends keyof cs.RestData> = {
    (tname: TName): ConfigDataExtension_ByTName<TName>
}

type Preset_NewStd_Params<AutoGen extends {}> = {
    readonly autogen: AutoGen
}

const preset_new_std = function <TName extends keyof cs.RestData, AutoGen extends {}>(params: Preset_NewStd_Params<AutoGen>) {
    return (tname: TName) => {
        return {
            get: {
                limit_new: async query => query.limit,
                fseq_new_child: async () => null,

                fseq_new: async query => {
                    if (typeof query.cursor === "string") {
                        return ksly.sql`${ksly.sql.raw(tname)}.id <= ${query.cursor}`
                    }

                    return null
                },

                access_check: async query => {
                    const checks = new Array<RestRoutes_AccessCheck>()

                    if ("pick_owner" in query) {
                        if (!query.pick_owner) {
                            return [accesscheck_ismod]
                        }

                        for (const owner of query.pick_owner) {
                            if (owner === "null-public") {
                                continue
                            }

                            if (owner === "null-private") {
                                return [accesscheck_ismod]
                            }

                            checks.push(async acc => {
                                return await accesscheck_ismod(acc) || (acc.id === owner)
                            })
                        }
                    }

                    if ("include_hidden" in query) {
                        if (query.include_hidden === 1) {
                            return [accesscheck_ismod]
                        }
                    }

                    return checks
                },
            },

            post: {
                node_convert: async (input, config) => {
                    return {
                        ...input,
                        ...config,
                        ...params.autogen,
                    } as ((
                        cs.RestData[TName]["post"]["body"][number]["core"]
                        & RestRoutes_DataConfig_PostNodeConvertConfig
                        & AutoGen
                    ))
                }
            },

            patch: {},
            delete: {},
        } as const satisfies ConfigDataExtension<QueryStd, cs.RestData[TName]["post"]["body"]>
    }
}

type Preset_NewHidable_Params = {
}

const preset_new_hidable = function <TName extends keyof cs.RestData>(params: Preset_NewHidable_Params) {
    return (tname: TName) => {
        return {
            get: {
                fseq_new: async query => {
                    if (!query.include_hidden) {
                        return ksly.sql`${ksly.sql.raw(tname)}.status_hidden = 0`
                    }

                    return null
                },

                fseq_new_child: async parent => {
                    if ("include_hidden" in parent.query) {
                        if (!parent.query.include_hidden) {
                            return ksly.sql`${ksly.sql.raw(tname)}.status_hidden = 0`
                        }
                    }

                    return ksly.sql`${ksly.sql.raw(tname)}.status_hidden = 0`
                },
            },

            post: {
                access_check: async body => {
                    for (const node of body) {
                        if (node.core.status_hidden === 1) {
                            return [accesscheck_ismod]
                        }
                    }

                    return []
                },
            },

            patch: {
            },

            delete: {
            },
        } as const satisfies ConfigDataExtension<QueryHidable, BodyPostHidable>
    }
}

type Preset_NewReadonly_Params = {
}

const preset_new_readonly = function <TName extends keyof cs.RestData>(params: Preset_NewReadonly_Params) {
    return (_tname: TName) => {
        return {
            get: {},

            post: {
                access_check: async _body => {
                    return [accesscheck_ismod]
                },
            },

            patch: {
                access_check: async _body => {
                    return [accesscheck_ismod]
                },
            },

            delete: {
                access_check: async _body => {
                    return [accesscheck_ismod]
                },
            },
        } as const satisfies ConfigDataExtension<{}, BodyPostStd>
    }
}

type Preset_NewStatic_Params = {
}

const preset_new_static = function <TName extends keyof cs.RestData>(params: Preset_NewStatic_Params) {
    return (_tname: TName) => {
        return {
            get: {},
            post: {},

            patch: {
                access_check: async _body => {
                    return [accesscheck_ismod]
                },
            },

            delete: {
                access_check: async _body => {
                    return [accesscheck_ismod]
                },
            },
        } as const satisfies ConfigDataExtension<{}, BodyPostStd>
    }
}

type Preset_NewWriteonly_Params = {
}

const preset_new_writeonly = function <TName extends keyof cs.RestData>(params: Preset_NewWriteonly_Params) {
    return (_tname: TName) => {
        return {
            post: {},
            patch: {},
            delete: {},

            get: {
                access_check: async _body => {
                    return [accesscheck_ismod]
                },
            },
        } as const satisfies ConfigDataExtension<{}, BodyPostStd>
    }
}

type Preset_NewOwnable_Params = {
    readonly status_nullpublic: boolean
}

const preset_new_ownable = function(params: Preset_NewOwnable_Params) {
    return (tname: keyof cs.RestData) => {
        return {
            get: {
                fseq_new: async query => {
                    if (query.pick_owner === null) {
                        return null
                    }

                    let owner_hasnull = false
                    let owner_allowed: null | ksly.RawBuilder<unknown> = null

                    if (query.pick_owner) {
                        for (const owner of query.pick_owner) {
                            if (owner === "null-private") {
                                owner_hasnull = true
                            } else if (owner === "null-public") {
                                if (params.status_nullpublic) {
                                    owner_hasnull = true
                                }
                            } else {
                                if (owner_allowed) {
                                    owner_allowed = ksly.sql`${owner_allowed}, ${owner}`
                                } else {
                                    owner_allowed = ksly.sql`${owner}`
                                }
                            }
                        }

                        if (owner_allowed) {
                            owner_allowed = ksly.sql`(${owner_allowed})`
                        }
                    }

                    if (!owner_hasnull && !owner_allowed) {
                        return ksly.sql`0 = 1`
                    }

                    return sql_new_fseq_or([
                        owner_hasnull ? ksly.sql`${ksly.sql.raw(tname)}.owner is null` : null,
                        owner_allowed ? ksly.sql`${ksly.sql.raw(tname)}.owner in ${owner_allowed}` : null,
                    ])
                },

                fseq_new_child: async parent => {
                    const query = parent.query

                    if ("pick_owner" in query) {
                        if (query.pick_owner === null) {
                            return null
                        }

                        let owner_hasnull = false
                        let owner_allowed: null | ksly.RawBuilder<unknown> = null

                        if (query.pick_owner) {
                            for (const owner of query.pick_owner) {
                                if (owner === "null-private") {
                                    owner_hasnull = true
                                } else if (owner === "null-public") {
                                    if (params.status_nullpublic) {
                                        owner_hasnull = true
                                    }
                                } else {
                                    if (owner_allowed) {
                                        owner_allowed = ksly.sql`${owner_allowed}, ${owner}`
                                    } else {
                                        owner_allowed = ksly.sql`${owner}`
                                    }
                                }
                            }

                            if (owner_allowed) {
                                owner_allowed = ksly.sql`(${owner_allowed})`
                            }
                        }

                        if (!owner_hasnull && !owner_allowed) {
                            return ksly.sql`0 = 1`
                        }

                        return sql_new_fseq_or([
                            owner_hasnull ? ksly.sql`${ksly.sql.raw(tname)}.owner is null` : null,
                            owner_allowed ? ksly.sql`${ksly.sql.raw(tname)}.owner in ${owner_allowed}` : null,
                        ])
                    } else {
                        if (params.status_nullpublic) {
                            return ksly.sql`${ksly.sql.raw(tname)}.owner is null`
                        } else {
                            return ksly.sql`0 = 1`
                        }
                    }

                    return null
                },
            },

            post: {
                access_check: async body => {
                    return [async acc => {
                        if (await accesscheck_ismod(acc)) {
                            return true
                        }

                        for (const node of body) {
                            if (node.core.owner === null) {
                                return false
                            }

                            if (node.core.owner !== acc.id) {
                                return false
                            }
                        }

                        return true
                    }]
                },
            },

            delete: {
                access_check: async body => {
                    return [async acc => {
                        if (await accesscheck_ismod(acc)) {
                            return true
                        }

                        return await db.transaction().execute(async trx => {
                            const check = await ksly.sql<1>`
                                select 
                                    1 
                                from ${ksly.sql.raw(tname)}
                                where
                                    (${ksly.sql.raw(tname)}.owner is null or ${ksly.sql.raw(tname)}.owner != ${acc.id})
                                    and ${ksly.sql.raw(tname)}.id in ${sql_new_val_list(body.ids.map(id => ksly.sql`${id}`))}
                                limit 1
                            `.execute(trx)

                            if (check.rows.length >= 1) {
                                return false
                            }

                            return true
                        })
                    }]
                }
            },

            patch: {
                access_check: async body => {
                    return [async acc => {
                        if (await accesscheck_ismod(acc)) {
                            return true
                        }

                        return await db.transaction().execute(async trx => {
                            const check = await ksly.sql<1>`
                                select 
                                    1 
                                from ${ksly.sql.raw(tname)}
                                where
                                    (${ksly.sql.raw(tname)}.owner is null or ${ksly.sql.raw(tname)}.owner != ${acc.id})
                                    and ${ksly.sql.raw(tname)}.id = ${ksly.sql`${body.id}`}
                            `.execute(trx)

                            if (check.rows.length >= 1) {
                                return false
                            }

                            return true
                        })
                    }]
                },
            },
        } as const satisfies ConfigDataExtension<QueryOwnable, BodyPostOwnable>
    }
}

type Preset_NewPickers_Params<Fields extends readonly string[]> = {
    readonly fields: Fields
}

const preset_new_pickers = function <Fields extends readonly string[]>(params: Preset_NewPickers_Params<Fields>) {
    type Picker = (
        | null
        | Array<string | number | null>
    )

    type QueryPickers = {
        [K in Fields[number]as `pick_${K}`]: Picker
    }

    return (tname: keyof cs.RestData) => {
        return {
            post: {},
            patch: {},
            delete: {},

            get: {
                fseq_new: async (query: QueryPickers) => {
                    const seqs = new Array<ksly.RawBuilder<unknown> | null>()

                    for (const field of params.fields as readonly Fields[number][]) {
                        const field_pick = query[`pick_${field}`] as Picker

                        if (field_pick !== null) {
                            let field_hasnull = false
                            let field_allowedlist: null | ksly.RawBuilder<unknown> = null

                            for (const value of field_pick) {
                                if (value === null) {
                                    field_hasnull = true
                                } else {
                                    if (field_allowedlist) {
                                        field_allowedlist = ksly.sql`${field_allowedlist}, ${value}`
                                    } else {
                                        field_allowedlist = ksly.sql`${value}`
                                    }
                                }
                            }

                            if (field_allowedlist) {
                                field_allowedlist = ksly.sql`(${field_allowedlist})`
                            } else {
                                field_allowedlist = ksly.sql.raw(`()`)
                            }

                            seqs.push(sql_new_fseq_or([
                                field_hasnull ? ksly.sql`${ksly.sql.raw(tname)}.${ksly.sql.raw(field)} is null` : null,
                                ksly.sql`${ksly.sql.raw(tname)}.${ksly.sql.raw(field)} in ${field_allowedlist}`,
                            ]))
                        }
                    }

                    return sql_new_fseq_and(seqs)
                },
            },
        } as const satisfies ConfigDataExtension<QueryPickers, BodyPostOwnable>
    }
}

type Preset_NewSearch_Def<Param> = {
    readonly label_list: readonly string[]
    readonly fseq_new: (param: Param) => ksly.RawBuilder<unknown> | null
}

type Preset_NewSearch_Params = {
    readonly def_number: Preset_NewSearch_Def<number>[]
    readonly def_string: Preset_NewSearch_Def<string>[]
}

const preset_new_search = function(params: Preset_NewSearch_Params) {
    type QuerySearch = {
        readonly search: sxs.Schema | null
    }

    return (tname: keyof cs.RestData) => {
        return {
            post: {},
            patch: {},
            delete: {},

            get: {
                fseq_new: async (query: QuerySearch) => {
                    if (query.search === null) {
                        return null
                    }

                    const compute = new WeakMap<sxs.Schema, ksly.RawBuilder<unknown> | null>()
                    const stack = [query.search]

                    while (stack.length) {
                        const schema = stack[stack.length - 1]!

                        switch (schema.op) {
                            case "&":
                            case "|": {
                                let status_filled = true

                                const children_fseq = new Array<ksly.RawBuilder<unknown>>()

                                for (const child_schema of schema.children) {
                                    const child_fseq = compute.get(child_schema)

                                    if (child_fseq === undefined) {
                                        status_filled = false

                                        stack.push(child_schema)
                                    } else {
                                        if (child_fseq) {
                                            children_fseq.push(child_fseq)
                                        }
                                    }
                                }

                                if (status_filled) {
                                    if (schema.op === "&") {
                                        compute.set(schema, sql_new_fseq_and(children_fseq))
                                    } else if (schema.op === "|") {
                                        compute.set(schema, sql_new_fseq_or(children_fseq))
                                    } else {
                                        throw new Error(`unexpected operator ${schema.op}`)
                                    }

                                    stack.length -= 1
                                }

                                break
                            }
                            case "~": {
                                compute.set(schema, sql_new_fseq_or(
                                    params.def_string.map(def => def.fseq_new(schema.value))
                                ))

                                stack.length -= 1

                                break
                            }
                            case "=": {
                                compute.set(
                                    schema,
                                    params.def_string.find(
                                        def => def.label_list.includes(schema.label)
                                    )?.fseq_new(schema.value) ?? null
                                )

                                stack.length -= 1

                                break
                            }
                            case "<":
                            case "<=":
                            case ">":
                            case ">=": {
                                compute.set(
                                    schema,
                                    params.def_number.find(
                                        def => def.label_list.includes(schema.label)
                                    )?.fseq_new(schema.value) ?? null
                                )

                                stack.length -= 1

                                break
                            }
                        }
                    }

                    return compute.get(query.search) ?? null
                },
            },
        } as const satisfies ConfigDataExtension<QuerySearch, BodyPostOwnable>
    }
}

type Config_New_Cobinator<Src extends readonly ((...params: any) => unknown)[]> = (
    (Src extends readonly [infer Head, ...infer Tail]
        ? (
            & (Head extends (...params: any) => infer Return ? Return : Head)
            & (Tail extends readonly ((...params: any) => unknown)[]
                ? Config_New_Cobinator<Tail>
                : { get: {}, post: {}, patch: {}, delete: {}, }
            )
        )
        : { get: {}, post: {}, patch: {}, delete: {}, }
    )
)

const config_new_data = function <TName extends keyof cs.RestData, Extensions extends readonly ConfigDataExtension_Factory<TName>[]>(
    tname: TName, extensions: Extensions
): Config_New_Cobinator<Extensions> {
    return extensions.reduce<ConfigDataExtension_ByTName<TName>>(
        (left, ext) => {
            const right = ext(tname)

            return {
                get: {
                    ...left.get,
                    ...right.get,

                    access_skip: async query => {
                        if (await left.get.access_skip?.(query)) {
                            return true
                        }

                        return (await right.get.access_skip?.(query)) ?? false
                    },

                    access_check: async query => {
                        const left_checks = (await left.get.access_check?.(query)) ?? []
                        const right_checks = (await right.get.access_check?.(query)) ?? []

                        return [...left_checks, ...right_checks]
                    },

                    fseq_new: async query => {
                        return sql_new_fseq_and([
                            (await left.get.fseq_new?.(query)) ?? null,
                            (await right.get.fseq_new?.(query)) ?? null,
                        ])
                    },

                    fseq_new_child: async parent => {
                        return sql_new_fseq_and([
                            (await left.get.fseq_new_child?.(parent)) ?? null,
                            (await right.get.fseq_new_child?.(parent)) ?? null,
                        ])
                    },
                },

                post: {
                    ...left.post,
                    ...right.post,

                    access_skip: async body => {
                        if (await left.post.access_skip?.(body)) {
                            return true
                        }

                        return (await right.post.access_skip?.(body)) ?? false
                    },

                    access_check: async body => {
                        const left_checks = (await left.post.access_check?.(body)) ?? []
                        const right_checks = (await right.post.access_check?.(body)) ?? []

                        return [...left_checks, ...right_checks]
                    },
                },

                patch: {
                    ...left.patch,
                    ...right.patch,

                    access_skip: async body => {
                        if (await left.patch.access_skip?.(body)) {
                            return true
                        }

                        return (await right.patch.access_skip?.(body)) ?? false
                    },

                    access_check: async body => {
                        const left_checks = (await left.patch.access_check?.(body)) ?? []
                        const right_checks = (await right.patch.access_check?.(body)) ?? []

                        return [...left_checks, ...right_checks]
                    },
                },

                delete: {
                    ...left.delete,
                    ...right.delete,

                    access_skip: async body => {
                        if (await left.delete.access_skip?.(body)) {
                            return true
                        }

                        return (await right.delete.access_skip?.(body)) ?? false
                    },

                    access_check: async body => {
                        const left_checks = (await left.delete.access_check?.(body)) ?? []
                        const right_checks = (await right.delete.access_check?.(body)) ?? []

                        return [...left_checks, ...right_checks]
                    },
                },
            }
        },
        {
            get: {},
            post: {},
            patch: {},
            delete: {},
        }
    ) as any
}

const config: RestRoutes_Config = {
    img: {
        get: {
            fseq_new_child: async () => null,
            area_new: async query => query.area,

            fseq_new: async query => {
                return sql_new_fseq_and([
                    ksly.sql`img.id = ${query.id}`,
                ])
            },
        },

        post: {
            access_check: async () => [accesscheck_ismod],

            node_convert: async (input, config) => {
                return {
                    ...input,
                    ...config,

                    deleted: 0,
                }
            },

            variant_convert: async (input, config) => {
                return {
                    ...config,

                    id: uuid(),
                    deleted: 0,
                    img__id: input.id,
                }
            },

            file_new: async files => {
                return files.img[0] as any as eu.MulterFile
            },
        },

        delete: {
            access_check: async () => [accesscheck_ismod]
        },
    },

    acc: config_new_data("acc", [
        preset_new_std({ autogen: { deleted: 0, status_sessional: 0, access: cst.AccountAccess.Casual, } as const, }),
        preset_new_readonly({}),
        preset_new_writeonly({}),
    ] as const),

    acc_authemail: config_new_data("acc_authemail", [
        preset_new_std({ autogen: { deleted: 0, password_hash: "0", password_salt: "0", } as const, }),
        preset_new_readonly({}),
        // will not affect write as they are already sealed
        // will allow reading for owned auth's
        preset_new_ownable({ status_nullpublic: false, }),
    ] as const),

    ping_device: config_new_data("ping_device", [
        preset_new_std({ autogen: { deleted: 0, } as const, }),
        preset_new_readonly({}),
        preset_new_writeonly({}),
        preset_new_pickers({ fields: ["token"], } as const)
    ] as const),

    ping_msg: config_new_data("ping_msg", [
        preset_new_std({ autogen: { deleted: 0, status_checked: 0, } as const, }),
        preset_new_readonly({}),
        preset_new_writeonly({}),
        preset_new_pickers({ fields: ["owner"] as const, })
    ] as const),

    delivery_division: config_new_data("delivery_division", [
        preset_new_std({ autogen: { deleted: 0, } as const, }),
        preset_new_readonly({}),

        tname => {
            return {
                post: {},
                patch: {},
                delete: {},

                get: {
                    fseq_new: async query => {
                        return sql_new_fseq_and([
                            (query.pick_cities
                                ? ksly.sql`
                                    ${ksly.sql.raw(tname)}.city_numid 
                                        in ${sql_new_val_list(query.pick_cities.map(numid => ksly.sql`${numid}`))}
                                `
                                : null
                            ),

                            (query.pick_parents
                                ? ksly.sql`
                                    ${ksly.sql.raw(tname)}.parent_numid 
                                        in ${sql_new_val_list(query.pick_parents.map(numid => ksly.sql`${numid}`))}
                                `
                                : null
                            ),
                        ])
                    },
                },
            } as const
        }
    ] as const),

    contact_message: config_new_data("contact_message", [
        preset_new_std({ autogen: { deleted: 0, status_reviewed: 0, } as const, }),
        preset_new_ownable({ status_nullpublic: false, }),
        preset_new_static({}),

        preset_new_search({
            def_number: [],

            def_string: [
                {
                    label_list: ["email", "mail", "post", "em", "m"],

                    fseq_new: value => {
                        return (
                            ksly.sql`lower(contact_message.email) like ${`%${value.toLowerCase()}%`}`
                        )
                    }
                },

                {
                    label_list: ["topic", "theme", "thema", "t"],

                    fseq_new: value => {
                        return (
                            ksly.sql`lower(contact_message.topic) like ${`%${value.toLowerCase()}%`}`
                        )
                    }
                },

                {
                    label_list: ["content", "message", "msg", "m"],

                    fseq_new: value => {
                        return (
                            ksly.sql`lower(contact_message.content) like ${`%${value.toLowerCase()}%`}`
                        )
                    }
                },

                {
                    label_list: ["reviewed", "viewed", "status_reviewed", "seen", "read", "r"],

                    fseq_new: value => {
                        let value_int = Number.parseInt(value)

                        switch (value) {
                            case "t":
                            case "true":
                                value_int = 1

                                break
                            case "f":
                            case "false":
                                value_int = 0

                                break
                            default:
                                value_int = Number.parseInt(value)

                                break
                        }

                        if (value_int === 0 || value_int === 1) {
                            return (
                                ksly.sql`contact_message.status_reviewed = ${value_int}`
                            )
                        }

                        return null
                    }
                },

            ],
        }),
    ] as const),

    item: config_new_data("item", [
        preset_new_std({ autogen: { deleted: 0, } as const, }),
        preset_new_readonly({}),
        preset_new_hidable({}),
        preset_new_pickers({ fields: ["tmplit__id"], } as const),

        preset_new_search({
            def_number: [],

            def_string: [
                {
                    label_list: ["n", "h", "name", "head", "header", "value", "title"],

                    fseq_new: value => {
                        return (
                            ksly.sql`lower(item.name) like ${`%${value.toLowerCase()}%`}`
                        )

                    }
                },

                {
                    label_list: ["t", "tag", "tagname", "tagvalue"],

                    fseq_new: value => {
                        return (ksly.sql`
                            EXISTS (
                                select
                                    1
                                from item_reftag
                                left join item_tag on item_tag.id = item_reftag.item_tag__id
                                where (
                                    item_reftag.item__id = item.id
                                    and lower(item_tag.name) like ${`%${value.toLowerCase()}%`}
                                    and item_tag.deleted = 0
                                    and item_reftag.deleted = 0
                                )
                            )
                        `)
                    }
                }
            ],

        }),

        () => {
            type QueryItem = {
                readonly filter_tag__id: (readonly string[]) | null
            }

            return {
                post: {},
                patch: {},
                delete: {},

                get: {
                    fseq_new: async (query: QueryItem) => {
                        if (query.filter_tag__id) {
                            const sqlq_ids = sql_new_val_list(query.filter_tag__id.map(id => ksly.sql`${id}`))

                            return ksly.sql`EXISTS (
                                select
                                    1
                                from item_reftag
                                left join item_tag on item_tag.id = item_reftag.item_tag__id
                                where (
                                    item_reftag.item__id = item.id
                                    and item_reftag.item_tag__id in ${sqlq_ids}
                                    and item_tag.deleted = 0
                                    and item_reftag.deleted = 0
                                )
                            )`
                        }

                        return null
                    },
                },
            } as const
        },
    ] as const),

    item_tl: config_new_data("item_tl", [
        preset_new_std({ autogen: { deleted: 0, } as const, }),
        preset_new_readonly({}),
        preset_new_pickers({ fields: ["source__id"], } as const),
    ] as const),

    item_refimg: config_new_data("item_refimg", [
        preset_new_std({ autogen: { deleted: 0, } as const, }),
        preset_new_readonly({}),
    ] as const),

    item_tag: config_new_data("item_tag", [
        preset_new_std({ autogen: { deleted: 0, } as const, }),
        preset_new_readonly({}),
        preset_new_hidable({}),
        () => {
            type QueryItemTag = {
                readonly filter_tmplit__id: (readonly string[]) | null
            }

            return {
                post: {},
                patch: {},
                delete: {},

                get: {
                    fseq_new: async (query: QueryItemTag) => {
                        if (query.filter_tmplit__id) {
                            const sqlq_ids = sql_new_val_list(query.filter_tmplit__id.map(id => ksly.sql`${id}`))

                            return ksly.sql`EXISTS (
                                select
                                    1
                                from item_reftag
                                join item on item.id = item_reftag.item__id
                                where (
                                    item.tmplit__id in (${sqlq_ids})
                                    and item_reftag.item_tag__id = item_tag.id
                                    and item.deleted = 0
                                    and item_reftag.deleted = 0
                                )
                            )`
                        }

                        return null
                    },
                },
            } as const
        },
    ] as const),

    item_tag_tl: config_new_data("item_tag_tl", [
        preset_new_std({ autogen: { deleted: 0, } as const, }),
        preset_new_readonly({}),
        preset_new_pickers({ fields: ["source__id"], } as const),
    ] as const),

    item_reftag: config_new_data("item_reftag", [
        preset_new_std({ autogen: { deleted: 0, } as const, }),
        preset_new_readonly({}),
    ] as const),

    tmplit: config_new_data("tmplit", [
        preset_new_std({ autogen: { deleted: 0, } as const, }),
        preset_new_readonly({}),
        preset_new_hidable({}),

        preset_new_search({
            def_number: [],
            def_string: [
                {
                    label_list: ["n", "h", "name", "head", "header", "value", "title"],

                    fseq_new: value => {
                        return (
                            ksly.sql`lower(tmplit.name) like ${`%${value.toLowerCase()}%`}`
                        )

                    }
                },
            ],
        }),
    ] as const),

    tmplit_tl: config_new_data("tmplit_tl", [
        preset_new_std({ autogen: { deleted: 0, } as const, }),
        preset_new_readonly({}),
        preset_new_pickers({ fields: ["source__id"], } as const),
    ] as const),

    tmplit_refimg: config_new_data("tmplit_refimg", [
        preset_new_std({ autogen: { deleted: 0, } as const, }),
        preset_new_readonly({}),
    ] as const),

    tmplmt: config_new_data("tmplmt", [
        preset_new_std({ autogen: { deleted: 0, } as const, }),
        preset_new_readonly({}),
        preset_new_hidable({}),

        preset_new_search({
            def_number: [],
            def_string: [
                {
                    label_list: ["n", "h", "name", "head", "header", "value", "title"],

                    fseq_new: value => {
                        return (
                            ksly.sql`lower(tmplmt.name) like ${`%${value.toLowerCase()}%`}`
                        )

                    }
                },
            ],
        })
    ] as const),

    tmplmt_tl: config_new_data("tmplmt_tl", [
        preset_new_std({ autogen: { deleted: 0, } as const, }),
        preset_new_readonly({}),
        preset_new_pickers({ fields: ["source__id"], } as const),
    ] as const),

    tmplmt_refimg: config_new_data("tmplmt_refimg", [
        preset_new_std({ autogen: { deleted: 0, } as const, }),
        preset_new_readonly({}),
    ] as const),

    material: config_new_data("material", [
        preset_new_std({ autogen: { deleted: 0, } as const, }),
        preset_new_readonly({}),
        preset_new_hidable({}),
        preset_new_pickers({ fields: ["tmplmt__id"], } as const),

        preset_new_search({
            def_number: [],
            def_string: [
                {
                    label_list: ["t", "tag", "tagname", "tagvalue"],

                    fseq_new: value => {
                        return (ksly.sql`
                            EXISTS (
                                select
                                    1
                                from material_reftag
                                join material_tag on material_tag.id = material_reftag.material_tag__id
                                where (
                                    material_reftag.material__id = material.id
                                    and lower(material_tag.name) like ${`%${value.toLowerCase()}%`}
                                )
                            )
                        `)
                    }
                }
            ],
        }),
    ] as const),

    material_refimg: config_new_data("material_refimg", [
        preset_new_std({ autogen: { deleted: 0, } as const, }),
        preset_new_readonly({}),
    ] as const),

    material_tag: config_new_data("material_tag", [
        preset_new_std({ autogen: { deleted: 0, } as const, }),
        preset_new_readonly({}),
        preset_new_hidable({}),

        () => {
            type QueryMaterialTag = {
                readonly filter_tmplmt__id: (readonly string[]) | null
            }

            return {
                post: {},
                patch: {},
                delete: {},

                get: {
                    fseq_new: async (query: QueryMaterialTag) => {
                        if (query.filter_tmplmt__id) {
                            const sqlq_ids = sql_new_val_list(query.filter_tmplmt__id.map(id => ksly.sql`${id}`))

                            return ksly.sql`EXISTS (
                                select
                                    1
                                from material_reftag
                                join material on material.id = material_reftag.material__id
                                where (
                                    material.tmplmt__id in (${sqlq_ids})
                                    and material_reftag.material_tag__id = material_tag.id
                                    and material.deleted = 0
                                    and material_reftag.deleted = 0
                                )
                            )`
                        }

                        return null
                    },
                },
            } as const
        },
    ] as const),

    material_tag_tl: config_new_data("material_tag_tl", [
        preset_new_std({ autogen: { deleted: 0, } as const, }),
        preset_new_readonly({}),
        preset_new_pickers({ fields: ["source__id"], } as const),
    ] as const),

    material_reftag: config_new_data("material_reftag", [
        preset_new_std({ autogen: { deleted: 0, } as const, }),
        preset_new_readonly({}),
    ] as const),

    tmplpr: config_new_data("tmplpr", [
        preset_new_std({ autogen: { deleted: 0, } as const, }),
        preset_new_readonly({}),
        preset_new_hidable({}),

        preset_new_search({
            def_number: [],
            def_string: [
                {
                    label_list: ["n", "h", "name", "head", "header", "value", "title"],

                    fseq_new: value => {
                        return (
                            ksly.sql`lower(tmplpr.name) like ${`%${value.toLowerCase()}%`}`
                        )

                    }
                },

            ],
        }),
    ] as const),

    tmplpr_tl: config_new_data("tmplpr_tl", [
        preset_new_std({ autogen: { deleted: 0, } as const, }),
        preset_new_readonly({}),
        preset_new_pickers({ fields: ["source__id"], } as const),
    ] as const),

    tmplpr_refimg: config_new_data("tmplpr_refimg", [
        preset_new_std({ autogen: { deleted: 0, } as const, }),
        preset_new_readonly({}),
    ] as const),

    tmplpr_arg: config_new_data("tmplpr_arg", [
        preset_new_std({ autogen: { deleted: 0, } as const, }),
        preset_new_readonly({}),
    ] as const),

    tmplpr_arg_tl: config_new_data("tmplpr_arg_tl", [
        preset_new_std({ autogen: { deleted: 0, } as const, }),
        preset_new_readonly({}),
        preset_new_pickers({ fields: ["source__id"], } as const),
    ] as const),

    tmplpr_arg_bool: config_new_data("tmplpr_arg_bool", [
        preset_new_std({ autogen: { deleted: 0, } as const, }),
        preset_new_readonly({}),
    ] as const),

    tmplpr_arg_bool_tl: config_new_data("tmplpr_arg_bool_tl", [
        preset_new_std({ autogen: { deleted: 0, } as const, }),
        preset_new_readonly({}),
        preset_new_pickers({ fields: ["source__id"], } as const),
    ] as const),

    tmplpr_arg_line: config_new_data("tmplpr_arg_line", [
        preset_new_std({ autogen: { deleted: 0, } as const, }),
        preset_new_readonly({}),
    ] as const),

    tmplpr_arg_line_mark: config_new_data("tmplpr_arg_line_mark", [
        preset_new_std({ autogen: { deleted: 0, } as const, }),
        preset_new_readonly({}),
    ] as const),

    tmplpr_arg_line_mark_tl: config_new_data("tmplpr_arg_line_mark_tl", [
        preset_new_std({ autogen: { deleted: 0, } as const, }),
        preset_new_readonly({}),
        preset_new_pickers({ fields: ["source__id"], } as const),
    ] as const),

    tmplpr_arg_rect: config_new_data("tmplpr_arg_rect", [
        preset_new_std({ autogen: { deleted: 0, } as const, }),
        preset_new_readonly({}),
    ] as const),

    tmplpr_arg_rect_mark: config_new_data("tmplpr_arg_rect_mark", [
        preset_new_std({ autogen: { deleted: 0, } as const, }),
        preset_new_readonly({}),
    ] as const),

    tmplpr_arg_rect_mark_tl: config_new_data("tmplpr_arg_rect_mark_tl", [
        preset_new_std({ autogen: { deleted: 0, } as const, }),
        preset_new_readonly({}),
        preset_new_pickers({ fields: ["source__id"], } as const),
    ] as const),

    tmplpr_arg_mat: config_new_data("tmplpr_arg_mat", [
        preset_new_std({ autogen: { deleted: 0, } as const, }),
        preset_new_readonly({}),
    ] as const),

    tmplpr_arg_mat_perm: config_new_data("tmplpr_arg_mat_perm", [
        preset_new_std({ autogen: { deleted: 0, } as const, }),
        preset_new_readonly({}),
    ] as const),

    variant: config_new_data("variant", [
        preset_new_std({ autogen: { deleted: 0 } as const }),
        preset_new_ownable({ status_nullpublic: true, }),
        preset_new_hidable({}),
        preset_new_pickers({ fields: ["item__id"], } as const),
    ] as const),

    variant_tl: config_new_data("variant_tl", [
        preset_new_std({ autogen: { deleted: 0, } as const, }),
        preset_new_ownable({ status_nullpublic: true, }),
        preset_new_pickers({ fields: ["source__id"], } as const),
    ] as const),

    prodset: config_new_data("prodset", [
        preset_new_std({ autogen: { deleted: 0, } as const }),
        preset_new_ownable({ status_nullpublic: true, }),
    ] as const),

    product: config_new_data("product", [
        preset_new_std({ autogen: { deleted: 0, } as const }),
        preset_new_ownable({ status_nullpublic: true, }),
        preset_new_pickers({ fields: ["tmplpr__id"], } as const),
    ] as const),

    product_argline: config_new_data("product_argline", [
        preset_new_std({ autogen: { deleted: 0, } as const }),
        preset_new_ownable({ status_nullpublic: true, }),
    ] as const),

    product_argrect: config_new_data("product_argrect", [
        preset_new_std({ autogen: { deleted: 0, } as const }),
        preset_new_ownable({ status_nullpublic: true, }),
    ] as const),

    product_argmat: config_new_data("product_argmat", [
        preset_new_std({ autogen: { deleted: 0, } as const }),
        preset_new_ownable({ status_nullpublic: true, }),
    ] as const),

    product_argbool: config_new_data("product_argbool", [
        preset_new_std({ autogen: { deleted: 0, } as const }),
        preset_new_ownable({ status_nullpublic: true, }),
    ] as const),

    cart_refnode: config_new_data("cart_refnode", [
        preset_new_std({ autogen: { deleted: 0, } as const }),
        preset_new_ownable({ status_nullpublic: false, }),
    ] as const),

    commision: config_new_data("commision", [
        preset_new_std({ autogen: { deleted: 0, paynment_amount: 0, status_delivered: 0, } as const }),
        preset_new_ownable({ status_nullpublic: false, }),

        preset_new_search({
            def_number: [],

            def_string: [
                {
                    label_list: ["city"],

                    fseq_new: value => {
                        return (ksly.sql`
                            EXISTS (
                                select
                                    1
                                from delivery_division
                                where (
                                    delivery_division.id = commision.delivery_division__id
                                    and lower(delivery_division.city_name) like ${`%${value.toLowerCase()}%`}
                                )
                            )
                        `)
                    }
                },

                {
                    label_list: ["region"],

                    fseq_new: value => {
                        return (ksly.sql`
                            EXISTS (
                                select
                                    1
                                from delivery_division
                                where (
                                    delivery_division.id = commision.delivery_division__id
                                    and lower(delivery_division.parent_name) like ${`%${value.toLowerCase()}%`}
                                )
                            )
                        `)
                    }
                },

                {
                    label_list: ["terminal", "division", "delivery"],

                    fseq_new: value => {
                        return (ksly.sql`
                            EXISTS (
                                select
                                    1
                                from delivery_division
                                where (
                                    delivery_division.id = commision.delivery_division__id
                                    and lower(delivery_division.name_full) like ${`%${value.toLowerCase()}%`}
                                )
                            )
                        `)
                    }
                },

                {
                    label_list: ["id", "id_public"],

                    fseq_new: value => {
                        return (
                            ksly.sql`lower(commision.id_public) like ${`%${value.toLowerCase()}%`}`
                        )
                    }
                },

                {
                    label_list: ["email", "mail", "post", "em", "m"],

                    fseq_new: value => {
                        return (
                            ksly.sql`lower(commision.contact_email) like ${`%${value.toLowerCase()}%`}`
                        )
                    }
                },

                {
                    label_list: ["phone", "telephone", "fone", "telefone", "ph"],

                    fseq_new: value => {
                        return (
                            ksly.sql`lower(commision.contact_phone) like ${`%${value.toLowerCase()}%`}`
                        )
                    }
                },

                {
                    label_list: ["firstname", "name", "name_first", "fn"],

                    fseq_new: value => {
                        return (
                            ksly.sql`lower(commision.contact_fname) like ${`%${value.toLowerCase()}%`}`
                        )
                    }
                },

                {
                    label_list: ["father", "name_father", "fath"],

                    fseq_new: value => {
                        return (
                            ksly.sql`lower(commision.contact_pname) like ${`%${value.toLowerCase()}%`}`
                        )
                    }
                },

                {
                    label_list: ["family", "name_family", "fam"],

                    fseq_new: value => {
                        return (
                            ksly.sql`lower(commision.contact_lname) like ${`%${value.toLowerCase()}%`}`
                        )
                    }
                },

                {
                    label_list: ["status_paid", "paid", "p"],

                    fseq_new: value => {
                        let value_int = Number.parseInt(value)

                        switch (value) {
                            case "t":
                            case "true":
                                value_int = 1

                                break
                            case "f":
                            case "false":
                                value_int = 0

                                break
                            default:
                                value_int = Number.parseInt(value)

                                break
                        }

                        if (value_int === 0) {
                            return ksly.sql`commision.paynment_amount = 0`
                        } else if (value_int === 1) {
                            return ksly.sql`commision.paynment_amount > 0`
                        }

                        return null
                    }
                },

                {
                    label_list: ["status_delivered", "delivered"],

                    fseq_new: value => {
                        let value_int = Number.parseInt(value)

                        switch (value) {
                            case "t":
                            case "true":
                                value_int = 1

                                break
                            case "f":
                            case "false":
                                value_int = 0

                                break
                            default:
                                value_int = Number.parseInt(value)

                                break
                        }

                        if (value_int === 0 || value_int === 1) {
                            return (
                                ksly.sql`commision.status_delivered = ${value_int}`
                            )
                        }

                        return null
                    }
                },
            ],
        }),

        tname => {
            type BodyPatchCommision = {
                readonly id: string

                readonly patch: {
                    readonly paynment_amount?: number
                    readonly status_delivered?: 0 | 1
                }
            }

            return {
                post: {},

                patch: {
                    access_check: async (body: BodyPatchCommision) => {
                        return [async acc => {
                            if (await accesscheck_ismod(acc)) {
                                return true
                            }

                            if ("paynment_amount" in body.patch || "status_delivered" in body.patch) {
                                return false
                            }

                            return await db.transaction().execute(async trx => {
                                const search = await (trx
                                    .selectFrom("commision")
                                    .select(["status_static"])
                                    .where("id", "=", body.id)
                                    .executeTakeFirst()
                                )

                                if (!search || search.status_static) {
                                    return false
                                }

                                return true
                            })
                        }]
                    },
                },

                delete: {
                    access_check: async body => {
                        return [async acc => {
                            if (await accesscheck_ismod(acc)) {
                                return true
                            }

                            return await db.transaction().execute(async trx => {
                                const search = await (trx
                                    .selectFrom("commision")
                                    .select(["status_static"])
                                    .where("id", "in", body.ids)
                                    .where("status_static", "=", 1)
                                    .executeTakeFirst()
                                )

                                if (!search || search.status_static) {
                                    return false
                                }

                                return true
                            })
                        }]
                    },
                },

                get: {
                    access_skip: async query => {
                        if (typeof query.id_public === "string" && query.limit === 1) {
                            return true
                        }

                        return false
                    },

                    fseq_new: async query => {
                        if (typeof query.id_public === "string") {
                            return ksly.sql`${ksly.sql.raw(tname)}.id_public = ${query.id_public}`
                        }

                        return null
                    },
                },
            } as const
        },
    ] as const),

    commision_refnode: config_new_data("commision_refnode", [
        preset_new_std({ autogen: { deleted: 0, } } as const),
        preset_new_static({}),
        preset_new_ownable({ status_nullpublic: false, })
    ] as const),

    commision_node: config_new_data("commision_node", [
        preset_new_std({ autogen: { deleted: 0, } } as const),
        preset_new_static({}),
        preset_new_ownable({ status_nullpublic: false, })
    ] as const),

    commision_node_tl: config_new_data("commision_node_tl", [
        preset_new_std({ autogen: { deleted: 0, } as const, }),
        preset_new_static({}),
        preset_new_ownable({ status_nullpublic: false, }),
        preset_new_pickers({ fields: ["source__id"], } as const),
    ] as const),

    commision_node_refimg: config_new_data("commision_node_refimg", [
        preset_new_std({ autogen: { deleted: 0, } } as const),
        preset_new_static({}),
        preset_new_ownable({ status_nullpublic: false, })
    ] as const),

    commision_product: config_new_data("commision_product", [
        preset_new_std({ autogen: { deleted: 0, } } as const),
        preset_new_static({}),
        preset_new_ownable({ status_nullpublic: false, })
    ] as const),

    commision_product_tl: config_new_data("commision_product_tl", [
        preset_new_std({ autogen: { deleted: 0, } as const, }),
        preset_new_static({}),
        preset_new_ownable({ status_nullpublic: false, }),
        preset_new_pickers({ fields: ["source__id"], } as const),
    ] as const),

    commision_product_refimg: config_new_data("commision_product_refimg", [
        preset_new_std({ autogen: { deleted: 0, } } as const),
        preset_new_static({}),
        preset_new_ownable({ status_nullpublic: false, })
    ] as const),

    commision_product_argline: config_new_data("commision_product_argline", [
        preset_new_std({ autogen: { deleted: 0, } } as const),
        preset_new_static({}),
        preset_new_ownable({ status_nullpublic: false, })
    ] as const),

    commision_product_argline_tl: config_new_data("commision_product_argline_tl", [
        preset_new_std({ autogen: { deleted: 0, } as const, }),
        preset_new_static({}),
        preset_new_ownable({ status_nullpublic: false, }),
        preset_new_pickers({ fields: ["source__id"], } as const),
    ] as const),

    commision_product_argbool: config_new_data("commision_product_argbool", [
        preset_new_std({ autogen: { deleted: 0, } } as const),
        preset_new_static({}),
        preset_new_ownable({ status_nullpublic: false, })
    ] as const),

    commision_product_argbool_tl: config_new_data("commision_product_argbool_tl", [
        preset_new_std({ autogen: { deleted: 0, } as const, }),
        preset_new_static({}),
        preset_new_ownable({ status_nullpublic: false, }),
        preset_new_pickers({ fields: ["source__id"], } as const),
    ] as const),

    commision_product_argrect: config_new_data("commision_product_argrect", [
        preset_new_std({ autogen: { deleted: 0, } } as const),
        preset_new_static({}),
        preset_new_ownable({ status_nullpublic: false, })
    ] as const),

    commision_product_argrect_tl: config_new_data("commision_product_argrect_tl", [
        preset_new_std({ autogen: { deleted: 0, } as const, }),
        preset_new_static({}),
        preset_new_ownable({ status_nullpublic: false, }),
        preset_new_pickers({ fields: ["source__id"], } as const),
    ] as const),

    commision_product_argmat: config_new_data("commision_product_argmat", [
        preset_new_std({ autogen: { deleted: 0, } } as const),
        preset_new_static({}),
        preset_new_ownable({ status_nullpublic: false, })
    ] as const),

    commision_product_argmat_tl: config_new_data("commision_product_argmat_tl", [
        preset_new_std({ autogen: { deleted: 0, } as const, }),
        preset_new_static({}),
        preset_new_ownable({ status_nullpublic: false, }),
        preset_new_pickers({ fields: ["source__id"], } as const),
    ] as const),

    commision_product_argmat_refimg: config_new_data("commision_product_argmat_refimg", [
        preset_new_std({ autogen: { deleted: 0, } } as const),
        preset_new_static({}),
        preset_new_ownable({ status_nullpublic: false, })
    ] as const),
}

export const rest = rest_new(config)
