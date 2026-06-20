import type { ImgNode_Data } from "@src/client/util/img/type/node"

export const img_data_top = function <I extends ImgNode_Data>(images: readonly I[]): I | null {
    for (const image of images) {
        return image
    }

    return null
}
