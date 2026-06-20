
export type TagRefNode_Tl = {
    readonly id: string
    readonly lang: string
    readonly tltable: Readonly<Record<string, string>>
}

export type TagRefNode_Tag = {
    readonly id: string
    readonly name: string
    readonly deleted: 0 | 1
    readonly tl: readonly TagRefNode_Tl[]
}

export type TagRefNode_Data = {
    readonly id: string
    readonly deleted: 0 | 1
    readonly tag: TagRefNode_Tag
}

export type TagRefNode = {
    readonly data: TagRefNode_Data | null
}
