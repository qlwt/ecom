import * as asc from "@qyu/atom-state-core"
import type { RemXDelivery_CityIndex, RemXDelivery_CityNodeDef } from "@src/remx/delivery/type/city"

export const remx_delivery__register_city = asc.atomfamily_new({
    key: (index: RemXDelivery_CityIndex) => index.numid,

    get: (index: RemXDelivery_CityIndex) => {
        return asc.atomremnode_new<RemXDelivery_CityNodeDef>({
            init: () => null,

            statics: () => ({
                numid: index.numid,
            })
        })
    }
})
