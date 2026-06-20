import type { ImgRefNode } from "@src/client/util/imgref/type/node"

export const imgref_node_top = function <I extends ImgRefNode>(images: readonly I[]): I | null {
    for (const image of images) {
        if (image.data) {
            return image
        }
    }

    return null
}
