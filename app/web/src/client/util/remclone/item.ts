import * as capi from "@fst/capi"
import * as gs from "@fst/gstate"
import type { RemClone_Product_MaterialMap } from "@src/client/util/remclone/product"
import { remclone_variant, type RemClone_Variant_Params_Overries } from "@src/client/util/remclone/variant"
import { v7 as uuid } from "uuid"

export type RemClone_Item_VariantMap = {
    readonly [ID in string]: RemClone_Variant_Params_Overries
}

export type RemClone_Item_Params_Tl = {
    readonly lang: string
    readonly tltable: Readonly<Record<string, string>>
}

export type RemClone_Item_Params_Overries = {
    readonly owner: string | null
    readonly status_hidden: 0 | 1

    readonly item_id?: string
    readonly item_name?: string
    readonly item_tl?: readonly RemClone_Item_Params_Tl[]

    readonly variantmap?: RemClone_Item_VariantMap
    readonly materialmap?: RemClone_Product_MaterialMap
}

export type RemClone_ItemNode_Params = {
    readonly src: gs.Rem_JoinData<"item">
    readonly overrides: RemClone_Item_Params_Overries
}

export const remclone_item_node = function(
    params: RemClone_ItemNode_Params
): capi.SendRest_DataPost_Body<"item">[number] {
    const item_id = params.overrides.item_id ?? uuid()

    return {
        core: {
            id: item_id,

            tmplit__id: params.src.tmplit__id,
            status_hidden: params.overrides.status_hidden,
            name: params.overrides.item_name ?? params.src.name,
        },

        joins: {
            reftags: params.src.reftags.map(reftag => {
                return {
                    core: {
                        id: uuid(),

                        item__id: item_id,
                        item_tag__id: reftag.item_tag__id,
                    },

                    joins: {},
                }
            }),

            refimgs: params.src.refimgs.map(refimg => {
                return {
                    core: {
                        id: uuid(),
                        item__id: item_id,
                        img__id: refimg.img__id,
                    },

                    joins: {},
                }
            }),

            tl: (params.overrides.item_tl
                ? params.overrides.item_tl.map(rawtl => {
                    return {
                        core: {
                            id: uuid(),

                            source__id: item_id,

                            lang: rawtl.lang,
                            tltable: rawtl.tltable,
                        },

                        joins: {},
                    }
                })
                : params.src.tl.map(tl => {
                    return {
                        core: {
                            id: uuid(),

                            source__id: item_id,

                            lang: tl.lang,
                            tltable: tl.tltable,
                        },

                        joins: {},
                    }
                })
            ),

            variants: params.src.variants.map(variant => {
                const variant_overrides = params.overrides.variantmap?.[variant.id]

                return remclone_variant({
                    ignore: {},
                    src: variant,

                    overrides: {
                        owner: params.overrides.owner,
                        status_hidden: variant.status_hidden,

                        item_id: item_id,
                        materialmap: params.overrides.materialmap,

                        ...variant_overrides,
                    }
                })
            }),
        },
    }
}
