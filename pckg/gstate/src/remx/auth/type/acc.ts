import * as cc from "@fst/config/client"

export type RemXAuth_NodeDef = {
    data: cc.RemDef["acc"]["data"]

    statics: {}
    request_meta: any
    request_result: any
}

export type RemXAuth_NodeJoinCore = cc.RemDef["acc"]["joins"]["core"]
