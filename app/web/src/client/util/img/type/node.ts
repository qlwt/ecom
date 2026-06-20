export type ImgNode_Data = {
    readonly id: string
    readonly url_raw?: string | null
}

export type ImgNode = {
    readonly data: null | ImgNode_Data
}

export type ImgSrcDef = {
    readonly src: string
    readonly srcset?: string
}
