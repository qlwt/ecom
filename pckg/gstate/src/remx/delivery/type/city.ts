import * as asc from "@qyu/atom-state-core"

export type RemXDelivery_CityIndex = {
    readonly numid: number
}

export interface RemXDelivery_CityNodeDef extends asc.AtomRemNode_Def {
    data: {
        name: string
        numid: number
        parent__numid: number
    }

    statics: {
        numid: number
    }
}

export type RemXDelivery_CityLoaderIndex_ByParent = {
    readonly parent__numid: number
}
