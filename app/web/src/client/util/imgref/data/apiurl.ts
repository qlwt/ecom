import { img_data_apiurl } from "@src/client/util/img/data/apiurl";
import type { ImgSrcDef } from "@src/client/util/img/type/node";
import type { ImgRefNode_Data } from "@src/client/util/imgref/type/node";

export const imgref_data_apiurl = function (imgdata: ImgRefNode_Data | null): ImgSrcDef | null {
    if (!imgdata) {
        return null
    }

    return img_data_apiurl(imgdata.img)
}
