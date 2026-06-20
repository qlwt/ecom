import type { FType } from "@src/ftype/type/ftype"

export type Field_Relation = {
    readonly table: string
    readonly field: string
}

export type Field = {
    readonly ftype: FType

    readonly status_unique: boolean
    readonly status_static: boolean
    readonly status_primary: boolean
    readonly status_indexed: boolean
    readonly status_private: boolean
    readonly status_autogen: boolean

    readonly relation: Field_Relation | null
}

export type FieldStr = `${"" | "?"}${"int64" | "int32"}${" static" | " primary" | ""}`
