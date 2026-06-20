import { img_data_apiurl } from "@src/client/util/img/data/apiurl";
import type { ImgSrcDef } from "@src/client/util/img/type/node";
import type { ImgRefNode } from "@src/client/util/imgref/type/node";

export const imgref_node_apiurl = function (imgnode: ImgRefNode | null): ImgSrcDef | null {
    if (!imgnode || !imgnode.data) {
        return null
    }

    return img_data_apiurl(imgnode.data.img)
}
