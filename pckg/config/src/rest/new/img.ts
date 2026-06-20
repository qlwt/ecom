import { ftype_new } from "@src/ftype/new"
import type { RestDefImg, RestDefImg_Delete, RestDefImg_Get, RestDefImg_Post } from "@src/rest/type/img"
import * as cst from "@fst/cst"

export type Rest_NewImg_Params = {
    readonly get?: RestDefImg_Get
    readonly post?: RestDefImg_Post
    readonly delete?: RestDefImg_Delete
}

export const rest_new_img = function(params?: Rest_NewImg_Params): RestDefImg {
    return {
        get: params?.get ?? {
            kind: "std",

            query: {
                id: ftype_new({ kind: "uuid", }),
                area: ftype_new({ kind: "int16", }),
            },
        },

        post: params?.post ?? {
            kind: "std",

            files: {
                img: ftype_new({
                    kind: "tuple",
                    children: [ftype_new({
                        kind: "file",
                        size: cst.config.server.img_maxsize,
                        mimetype: "image",
                    })],
                }),
            },
        },

        delete: params?.delete ?? {
            kind: "std",
        },
    }
}
