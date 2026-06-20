import * as asc from "@qyu/atom-state-core"
import { remx_delivery__act_parent_get } from "@src/remx/delivery/internal/act/parent_get"
import type { RemXDelivery_ParentLoaderIndex_ByCountry } from "@src/remx/delivery/type/parent"

export const remx_delivery__loader_parent_bycountry = asc.atomfamily_new({
    key: (index: RemXDelivery_ParentLoaderIndex_ByCountry) => index.country__code,

    get: (index: RemXDelivery_ParentLoaderIndex_ByCountry) => {
        return asc.atomloader_new_pure({
            throttler: asc.throttler_new_microtask(),

            connect: ({ reg }) => {
                const controller_abort = new AbortController()

                reg(remx_delivery__act_parent_get({
                    rparams: {
                        query: {
                            country__code: index.country__code,
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
