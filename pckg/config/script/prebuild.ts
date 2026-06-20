import { def } from "@src/def/index"
import { ftype_new } from "@src/server"
import { tstype_new_array } from "@src/tstype/new/array"
import { tstype_new_ftype } from "@src/tstype/new/ftype"
import { tstype_new_object, tstype_new_prop, type TSType_NewObject_Prop } from "@src/tstype/new/object"
import { tstype_new_raw } from "@src/tstype/new/raw"
import { object_new_map } from "@src/util/object/new/map"
import { object_new_mapfilter } from "@src/util/object/new/mapfilter"
import fs from "node:fs/promises"
import path from "node:path"

const build = async function() {
    try { await fs.mkdir(path.resolve("./src")) } catch (e) { }
    try { await fs.mkdir(path.resolve("./src/auto/server")) } catch (e) { }
    try { await fs.mkdir(path.resolve("./src/auto/server/type")) } catch (e) { }
    try { await fs.mkdir(path.resolve("./src/auto/client")) } catch (e) { }
    try { await fs.mkdir(path.resolve("./src/auto/client/type")) } catch (e) { }
    try { await fs.mkdir(path.resolve("./src/auto/shared")) } catch (e) { }
    try { await fs.mkdir(path.resolve("./src/auto/shared/type")) } catch (e) { }

    // filling in the shared
    {
        const resttype_data: Record<string, TSType_NewObject_Prop> = {}
        const resttype_img: Record<string, TSType_NewObject_Prop> = {}

        for (const [table_name, table] of Object.entries(def.table_public)) {
            const table_tssrc: Record<string, TSType_NewObject_Prop> = {}

            if (table.kind === "data") {
                if (table.rest.get.kind === "std") {
                    table_tssrc.get = tstype_new_prop(tstype_new_object({
                        query: tstype_new_prop(tstype_new_object(
                            object_new_map(table.rest.get.query, ftype => {
                                return tstype_new_prop(tstype_new_ftype(ftype))
                            })
                        )),
                    }))
                }

                if (table.rest.patch.kind === "std") {
                    table_tssrc.patch = tstype_new_prop(tstype_new_object({
                        body: tstype_new_prop(tstype_new_object({
                            id: tstype_new_prop(tstype_new_ftype(ftype_new("uuid"))),

                            patch: tstype_new_prop(tstype_new_object(
                                object_new_mapfilter(table.fields, field => {
                                    if (!(field.status_static || field.status_private)) {
                                        return tstype_new_prop(
                                            tstype_new_ftype(field.ftype),
                                            { status_optional: true, }
                                        )
                                    }

                                    return
                                })
                            )),
                        }))
                    }))
                }

                if (table.rest.delete.kind === "std") {
                    table_tssrc.delete = tstype_new_prop(tstype_new_object({
                        body: tstype_new_prop(tstype_new_object({
                            ids: tstype_new_prop(tstype_new_ftype(
                                ftype_new({ kind: "array", child: ftype_new("uuid"), })
                            ))
                        })),
                    }))
                }

                if (table.rest.post.kind === "std") {
                    table_tssrc.post = tstype_new_prop(tstype_new_object({
                        body: tstype_new_prop(tstype_new_array(tstype_new_object({
                            core: tstype_new_prop(tstype_new_object(
                                object_new_mapfilter(table.fields, field => {
                                    if (!(field.status_private || field.status_autogen)) {
                                        return tstype_new_prop(tstype_new_ftype(field.ftype))
                                    }

                                    return
                                })
                            )),

                            joins: tstype_new_prop(tstype_new_object(
                                object_new_mapfilter(table.joins.core, join => {
                                    if (!(join.target_table in def.table_public)) {
                                        throw new Error(`Joins refers to non-existen table ${join.target_table}`)
                                    } else if (def.table_public[join.target_table as keyof typeof def.table_public]!.kind !== "data") {
                                        return undefined
                                    }

                                    if (join.kind === "forwards") {
                                        return tstype_new_prop(
                                            tstype_new_raw(`Rest["${join.target_table}"]["post"]["body"][number] | null`),
                                            { status_optional: true }
                                        )
                                    } else if (join.kind === "backwards") {
                                        return tstype_new_prop(
                                            tstype_new_raw(`Rest["${join.target_table}"]["post"]["body"] | null`),
                                            { status_optional: true }
                                        )
                                    }

                                    return undefined
                                })
                            )),
                        })))
                    }))
                }

                resttype_data[table_name] = tstype_new_prop(tstype_new_object(table_tssrc))
            } else if (table.kind === "img") {
                if (table.rest.get.kind === "std") {
                    table_tssrc.get = tstype_new_prop(tstype_new_object({
                        query: tstype_new_prop(tstype_new_object(
                            object_new_map(table.rest.get.query, ftype => {
                                return tstype_new_prop(tstype_new_ftype(ftype))
                            })
                        )),
                    }))
                }

                if (table.rest.delete.kind === "std") {
                    table_tssrc.delete = tstype_new_prop(tstype_new_object({
                        body: tstype_new_prop(tstype_new_object({
                            ids: tstype_new_prop(tstype_new_ftype(
                                ftype_new({ kind: "array", child: ftype_new("uuid"), })
                            ))
                        })),
                    }))
                }

                if (table.rest.post.kind === "std") {
                    table_tssrc.post = tstype_new_prop(tstype_new_object({
                        body: tstype_new_prop(tstype_new_object(
                            object_new_mapfilter(table.fields, field => {
                                if (!(field.status_private || field.status_autogen)) {
                                    return tstype_new_prop(tstype_new_ftype(field.ftype))
                                }

                                return
                            })
                        )),

                        files: tstype_new_prop(tstype_new_object(
                            object_new_mapfilter(table.rest.post.files, (ftype, field_name) => {
                                if (ftype.def.kind === "tuple") {
                                    if (!ftype.def.children.every(child => child.def.kind === "file")) {
                                        throw new Error(`Using non-file child of array in files field ${field_name} for ${table_name}`)
                                    }

                                    return tstype_new_prop(tstype_new_ftype(ftype))
                                }

                                if (ftype.def.kind === "array") {
                                    if (ftype.def.child.def.kind !== "file") {
                                        throw new Error(`Using non-file child of array in files field ${field_name} for ${table_name}`)
                                    }

                                    return tstype_new_prop(tstype_new_ftype(ftype))
                                }

                                throw new Error(`Using non-array type in files field ${field_name} for ${table_name}`)
                            })
                        )),
                    }))
                }

                resttype_img[table_name] = tstype_new_prop(tstype_new_object(table_tssrc))
            }
        }

        await fs.writeFile(
            path.resolve("./src/auto/shared/type/rest.ts"),
            (
                `import * as cst from "@fst/cst"`
                + `\nimport * as sxs from "@fst/syntax-search"`
                + `\n\nexport type RestData = ${tstype_new_object(resttype_data).stringify({ indent: 0, })}`
                + `\n\nexport type RestImg = ${tstype_new_object(resttype_img).stringify({ indent: 0, })}`
                + `\n\nexport type Rest = (RestData & RestImg)`
            )
        )
    }

    // filling in the server
    {
        // generate the typings for database
        const tstype_database = tstype_new_object(object_new_map(
            { ...def.table_local, ...def.table_public, },
            table => {
                return tstype_new_prop(tstype_new_object(
                    object_new_map(table.fields, field => {
                        return tstype_new_prop(tstype_new_ftype(field.ftype))
                    })
                ))
            },
        ))

        const tstype_database_public = tstype_new_object(object_new_map(
            def.table_public,
            table => {
                return tstype_new_prop(tstype_new_object(
                    object_new_map(table.fields, field => {
                        return tstype_new_prop(tstype_new_ftype(field.ftype))
                    })
                ))
            },
        ))

        await fs.writeFile(
            path.resolve("./src/auto/server/type/database.ts"),
            (
                `import * as cst from "@fst/cst"`
                + `\n\nexport type Database = ${tstype_database.stringify({ indent: 0, })}`
                + `\n\nexport type DatabasePublic = ${tstype_database_public.stringify({ indent: 0, })}`
            )
        )
    }

    // filling in the client
    {
        const tstype_remdef_img = tstype_new_object(object_new_mapfilter(def.table_public, (table, table_name) => {
            if (table.kind !== "img") { return undefined }

            return tstype_new_prop(tstype_new_object({
                data: tstype_new_prop(tstype_new_object({
                    ...object_new_mapfilter(
                        table.fields,
                        field => {
                            if (field.status_private) {
                                return
                            }

                            return tstype_new_prop(tstype_new_ftype(field.ftype))
                        },
                    ),

                    url_raw: tstype_new_prop(tstype_new_raw(`string | null`)),
                })),

                joins: tstype_new_prop(tstype_new_object(object_new_map(
                    table.joins,
                    variant => {
                        return tstype_new_prop(tstype_new_object({
                            ...object_new_mapfilter(
                                table.fields,
                                field => {
                                    if (field.status_private) {
                                        return
                                    }

                                    return tstype_new_prop(tstype_new_ftype(field.ftype))
                                },
                            ),

                            url_raw: tstype_new_prop(tstype_new_raw(`string | null`)),

                            ...object_new_map(
                                variant,
                                join => {
                                    if (join.kind === "forwards") {
                                        if (join.status_optional) {
                                            return tstype_new_prop(tstype_new_raw(
                                                `RemDef["${join.target_table}"]["joins"]["${join.variant}"] | null`
                                            ))
                                        } else {
                                            return tstype_new_prop(tstype_new_raw(
                                                `RemDef["${join.target_table}"]["joins"]["${join.variant}"]`
                                            ))
                                        }
                                    } else if (join.kind === "backwards") {
                                        return tstype_new_prop(tstype_new_raw(
                                            `(RemDef["${join.target_table}"]["joins"]["${join.variant}"])[]`
                                        ))
                                    }

                                    throw new Error(`Unexpected join kind ${join.kind}`)
                                }
                            )
                        }))
                    },
                ))),
            }))
        }))

        const tstype_remdef_data = tstype_new_object(object_new_mapfilter(def.table_public, (table, table_name) => {
            if (table.kind !== "data") { return undefined }

            return tstype_new_prop(tstype_new_object({
                data: tstype_new_prop(tstype_new_object(object_new_mapfilter(
                    table.fields,
                    field => {
                        if (field.status_private) {
                            return
                        }

                        return tstype_new_prop(tstype_new_ftype(field.ftype))
                    },
                ))),

                joins: tstype_new_prop(tstype_new_object(object_new_map(
                    table.joins,
                    variant => {
                        return tstype_new_prop(tstype_new_object({
                            ...object_new_mapfilter(
                                table.fields,
                                field => {
                                    if (field.status_private) {
                                        return
                                    }

                                    return tstype_new_prop(tstype_new_ftype(field.ftype))
                                },
                            ),

                            ...object_new_map(
                                variant,
                                join => {
                                    if (join.kind === "forwards") {
                                        if (join.status_optional) {
                                            return tstype_new_prop(tstype_new_raw(
                                                `RemDef["${join.target_table}"]["joins"]["${join.variant}"] | undefined`
                                            ))
                                        } else {
                                            return tstype_new_prop(tstype_new_raw(
                                                `RemDef["${join.target_table}"]["joins"]["${join.variant}"]`
                                            ))
                                        }
                                    } else if (join.kind === "backwards") {
                                        return tstype_new_prop(tstype_new_raw(
                                            `(RemDef["${join.target_table}"]["joins"]["${join.variant}"])[]`
                                        ))
                                    }

                                    throw new Error(`Unexpected join kind ${join.kind}`)
                                }
                            )
                        }))
                    },
                ))),
            }))
        }))

        const content = object_new_map(def.table_public, table => {
            return {
                kind: table.kind,
                joins: table.joins,
            }
        })

        await fs.writeFile(
            path.resolve("./src/auto/client/type/dbref.ts"),
            (
                `import * as cst from "@fst/cst"`
                + `\n\nexport type RemDefImg = ${tstype_remdef_img.stringify({ indent: 0 })}`
                + `\n\nexport type RemDefData = ${tstype_remdef_data.stringify({ indent: 0 })}`
                + `\n\nexport type RemDef = (RemDefImg & RemDefData)`
            )
        )

        const content_str = JSON.stringify(
            content, undefined, "\t"
        ).replaceAll(
            /^(\s*)"(\w+)":/gm, "$1$2:"
        )

        await fs.writeFile(
            path.resolve("./src/auto/client/remdef.ts"),
            (
                `import type { DefClient } from "@src/def/type/client"`
                + `\n\nexport const remdef = ${content_str} satisfies DefClient`
            )
        )
    }
}

await build()
