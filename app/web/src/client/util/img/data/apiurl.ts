import * as cc from "@fst/config/client";
import { urlbase_api } from "@src/client/const/urlbase";
import type { ImgNode_Data, ImgSrcDef } from "@src/client/util/img/type/node";

type Query = cc.Rest["img"]["get"]["query"]

const query_new = function(id: string, area: number): Query {
    return {
        id,
        area,
    }
}

type Src_New_Params = {
    readonly query: Query
}

const src_new = function(params: Src_New_Params): string {
    const url = new URL(`${urlbase_api}/rest/img`)

    for (const key of Object.keys(params.query) as (keyof typeof params.query)[]) {
        url.searchParams.append(key, JSON.stringify(params.query[key]))
    }

    return url.toString()
}

// expected to be of .length >= 1
const sizes = [128, 256, 512, 1024, 2048, 4096]

export const img_data_apiurl = function(imgdata: ImgNode_Data | null): ImgSrcDef | null {
    if (!imgdata) {
        return null
    }

    if (imgdata.url_raw) {
        return {
            src: imgdata.url_raw,
        }
    }

    const srcs = sizes.map(area => {
        return {
            size: area,

            url: src_new({
                query: query_new(imgdata.id, area)
            }),
        }
    })

    return {
        src: srcs.at(-1)!.url,
        srcset: srcs.map(src => `${src.url} ${src.size}w`).join(", ")
    }
}
