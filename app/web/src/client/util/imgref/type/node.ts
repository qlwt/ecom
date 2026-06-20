import type { ImgNode_Data } from "@src/client/util/img/type/node"

export type ImgRefNode_Data = {
    readonly id: string
    readonly img: ImgNode_Data
}

export type ImgRefNode = {
    readonly data: null | ImgRefNode_Data
}
