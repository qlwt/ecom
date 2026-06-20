export type TSType_StringifyParams = {
    readonly indent: number
}

export type TSType = {
    readonly stringify: (params: TSType_StringifyParams) => string
}
