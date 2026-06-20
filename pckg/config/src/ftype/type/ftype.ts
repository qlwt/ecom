export type FType_DefNever = {
    readonly kind: "never"
}

export type FType_DefUnion = {
    readonly kind: "union"
    readonly children: readonly FType[]
}

export type FType_DefFile = {
    readonly kind: "file"
    readonly size: number
    readonly mimetype: string
}

export type FType_DefRecordText = {
    readonly kind: "record_text"
}

export type FType_DefTuple = {
    readonly kind: "tuple"
    readonly children: FType[]
}

export type FType_DefArray = {
    readonly kind: "array"
    readonly child: FType
}

export type FType_DefUUID = {
    readonly kind: "uuid"
}

export type FType_DefFormula = {
    readonly kind: "formula"
}

export type FType_DefText = {
    readonly kind: "text"
}

export type FType_DefCharSet = {
    readonly kind: "charset"
    readonly size: number
}

export type FType_DefEnumString = {
    readonly kind: "enum-string"
    readonly name: string | null
    readonly variants: readonly string[]
}

export type FType_DefEnumInt = {
    readonly kind: "enum-int"
    readonly name: string | null
    readonly variants: readonly number[]
}

export type FType_DefBool = {
    readonly kind: "bool"
}

export type FType_DefFloat = {
    readonly kind: "float"
}

export type FType_DefFloatDouble = {
    readonly kind: "double"
}

export type FType_DefInt16 = {
    readonly kind: "int16"
}

export type FType_DefInt32 = {
    readonly kind: "int32"
}

export type FType_DefInt64 = {
    readonly kind: "int64"
}

export type FType_DefSearch = {
    readonly kind: "search"
}

export type FType_Def = (
    | FType_DefNever
    | FType_DefUnion
    | FType_DefFile
    | FType_DefRecordText
    | FType_DefTuple
    | FType_DefArray
    | FType_DefUUID
    | FType_DefInt64
    | FType_DefInt32
    | FType_DefInt16
    | FType_DefBool
    | FType_DefEnumInt
    | FType_DefEnumString
    | FType_DefCharSet
    | FType_DefText
    | FType_DefFormula
    | FType_DefFloat
    | FType_DefFloatDouble
    | FType_DefSearch
)

export type FType = {
    readonly def: FType_Def
    readonly status_optional: boolean
}
