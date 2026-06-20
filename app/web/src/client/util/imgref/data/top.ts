import type { ImgRefNode_Data } from "@src/client/util/imgref/type/node"

export const imgref_data_top = function <I extends ImgRefNode_Data>(images: readonly I[]): I | null {
    for (const image of images) {
        return image
    }

    return null
}
