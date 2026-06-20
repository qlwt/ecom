import * as asc from "@qyu/atom-state-core"

export type RemXDelivery_ParentIndex = {
    readonly numid: number
}

export interface RemXDelivery_ParentNodeDef extends asc.AtomRemNode_Def {
    data: {
        name: string
        numid: number
        country__code: string
    }

    statics: {
        numid: number
    }
}

export type RemXDelivery_ParentLoaderIndex_ByCountry = {
    readonly country__code: string
}
