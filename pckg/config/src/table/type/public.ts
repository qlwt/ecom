import type { Field_NewStr_TypeDef } from "@src/field/new/str"
import type { Field } from "@src/field/type/field"
import type { Join_NewStr_Def } from "@src/join/new/str"
import type { Join } from "@src/join/type/join"
import type { RestDefData } from "@src/rest/type/data"
import type { RestDefImg } from "@src/rest/type/img"

export type Table_Field = {
    [K in string]: Field
}

export type Table_FieldInput = {
    [K in string]: Field | Field_NewStr_TypeDef
}

export type Table_Join = (
    & {
        core: {
            [K in string]: Join
        }
    }
    & {
        [K in string]: {
            [K in string]: Join
        }
    }
)

export type Table_JoinInput = {
    [K in string]: {
        [K in string]: Join | Join_NewStr_Def
    }
}

export type TablePublicImg = {
    kind: "img"
    rest: RestDefImg
    areas: number[]
    joins: Table_Join
    fields: Table_Field
    table_variant: string
}

export type TablePublicData = {
    kind: "data"
    rest: RestDefData
    joins: Table_Join
    fields: Table_Field
}

export type TablePublic = (
    | TablePublicImg
    | TablePublicData
)
