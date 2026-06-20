export type TmplMtNode_Tl = {
    readonly id: string
    readonly lang: string
    readonly tltable: Readonly<Record<string, string>>
}

export type TmplMtNode_Data = {
    readonly id: string
    readonly name: string
    readonly deleted: 0 | 1
    readonly tl: readonly TmplMtNode_Tl[]
}

export type TmplMtNode = {
    readonly data: TmplMtNode_Data | null
}
