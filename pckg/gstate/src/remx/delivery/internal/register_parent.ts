import * as asc from "@qyu/atom-state-core"
import type { RemXDelivery_ParentIndex, RemXDelivery_ParentNodeDef } from "@src/remx/delivery/type/parent"


export const remx_delivery__register_parent = asc.atomfamily_new({
    key: (index: RemXDelivery_ParentIndex) => index.numid,

    get: (index: RemXDelivery_ParentIndex) => {
        return asc.atomremnode_new<RemXDelivery_ParentNodeDef>({
            init: () => null,

            statics: () => ({
                numid: index.numid,
            })
        })
    }
})
