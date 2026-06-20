import type { FType } from "@src/client"
import { ftype_new } from "@src/ftype/new"
import type { RestDefData, RestDefData_Delete, RestDefData_Get, RestDefData_Patch, RestDefData_Post } from "@src/rest/type/data"

export type Rest_NewData_Params = {
    readonly get?: RestDefData_Get
    readonly post?: RestDefData_Post
    readonly patch?: RestDefData_Patch
    readonly delete?: RestDefData_Delete
}

export const rest_new_data = function(params?: Rest_NewData_Params): RestDefData {
    return {
        get: params?.get ?? {
            kind: "std",
            query: rest_getquery_new({}),
        },

        post: params?.post ?? {
            kind: "std",
        },

        patch: params?.patch ?? {
            kind: "std",
        },

        delete: params?.delete ?? {
            kind: "std",
        },
    }
}

export const rest_getquery_new = function(ext: Record<string, FType>) {
    return {
        limit: ftype_new({ kind: "int16", }, { status_optional: true, }),
        cursor: ftype_new({ kind: "uuid", }, { status_optional: true, }),

        include_hidden: ftype_new({ kind: "bool", }, { status_optional: true, }),

        pick_owner: ftype_new({
            kind: "array",
            child: ftype_new({
                kind: "union",

                children: [
                    ftype_new("uuid"),

                    ftype_new({
                        kind: "enum-string",
                        name: null,

                        variants: [
                            "null-public",
                            "null-private",
                        ],
                    }),
                ],
            }),
        }, { status_optional: true, }),

        ...ext,
    }
}
