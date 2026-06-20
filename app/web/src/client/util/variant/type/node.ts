export type VariantNode_Data ={
    readonly id: string
    readonly header: string
    readonly deleted: 0 | 1
}

export type VariantNode = {
    readonly data: VariantNode_Data | null
}
