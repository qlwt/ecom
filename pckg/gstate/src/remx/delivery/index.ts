import * as capi from "@fst/capi"
import { nrem_indexer_new } from "@src/rem/indexer/new"
import { remx_delivery__act_city_get } from "@src/remx/delivery/internal/act/city_get"
import { remx_delivery__act_parent_get } from "@src/remx/delivery/internal/act/parent_get"
import { remx_delivery__loader_city_byparent } from "@src/remx/delivery/internal/loader/city_byparent"
import { remx_delivery__loader_parent_bycountry } from "@src/remx/delivery/internal/loader/parent_bycountry"
import { remx_delivery__register_city } from "@src/remx/delivery/internal/register_city"
import { remx_delivery__register_parent } from "@src/remx/delivery/internal/register_parent"

export const remx_delivery_city = {
    register: remx_delivery__register_city,

    indexer_new: nrem_indexer_new({
        register: remx_delivery__register_city,
    }),

    act: {
        get: (rparams: capi.SendRestX_DeliveryCityGet_Params) => {
            return remx_delivery__act_city_get({
                rparams
            })
        },
    } as const,

    loaders: {
        get_byparent: remx_delivery__loader_city_byparent,
    } as const,
} as const

export const remx_delivery_parent = {
    register: remx_delivery__register_parent,

    indexer_new: nrem_indexer_new({
        register: remx_delivery__register_parent,
    }),

    act: {
        get: (rparams: capi.SendRestX_DeliveryParentGet_Params) => {
            return remx_delivery__act_parent_get({
                rparams
            })
        },
    } as const,

    loaders: {
        get_bycountry: remx_delivery__loader_parent_bycountry,
    } as const,
} as const
