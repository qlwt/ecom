import { img_data_apiurl } from "@src/client/util/img/data/apiurl";
import type { ImgNode, ImgSrcDef } from "@src/client/util/img/type/node";

export const img_node_apiurl = function(imgnode: ImgNode | null): ImgSrcDef | null {
    if (!imgnode) {
        return null
    }

    return img_data_apiurl(imgnode.data)
}
