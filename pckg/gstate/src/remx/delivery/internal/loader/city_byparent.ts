import * as asc from "@qyu/atom-state-core"
import { remx_delivery__act_city_get } from "@src/remx/delivery/internal/act/city_get"
import type { RemXDelivery_CityLoaderIndex_ByParent } from "@src/remx/delivery/type/city"

export const remx_delivery__loader_city_byparent = asc.atomfamily_new({
    key: (index: RemXDelivery_CityLoaderIndex_ByParent) => index.parent__numid,

    get: (index: RemXDelivery_CityLoaderIndex_ByParent) => {
        return asc.atomloader_new_pure({
            throttler: asc.throttler_new_microtask(),

            connect: ({ reg }) => {
                const controller_abort = new AbortController()

                reg(remx_delivery__act_city_get({
                    rparams: {
                        query: {
                            parent__numid: index.parent__numid,
                        },

                        config: {
                            signal_abort: controller_abort.signal,
                        },
                    },
                }))

                return () => {

                }
            },
        })
    }
})
