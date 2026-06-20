import type { ImgNode } from "@src/client/util/img/type/node"

export const img_node_top = function <I extends ImgNode>(images: readonly I[]): I | null {
    for (const image of images) {
        if (image.data) {
            return image
        }
    }

    return null
}
