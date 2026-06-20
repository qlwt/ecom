import * as capi from "@fst/capi"
import * as gs from "@fst/gstate"
import { remclone_product_node, type RemClone_Product_MaterialMap } from "@src/client/util/remclone/product"
import { v7 as uuid } from "uuid"

export type RemClone_Variant_Params_Tl = {
    readonly lang: string
    readonly tltable: Readonly<Record<string, string>>
}

export type RemClone_Variant_Params_Overries = {
    readonly owner: string | null
    readonly status_hidden: 0 | 1

    readonly item_id?: string

    readonly variant_id?: string
    readonly variant_header?: string
    readonly variant_description?: string

    readonly tl?: readonly RemClone_Variant_Params_Tl[]
    readonly materialmap?: RemClone_Product_MaterialMap

    readonly prodset_id?: string
}

export type RemClone_Variant_Params_Ignore = {
    readonly prodset?: boolean
}

export type RemClone_VariantNode_Params = {
    readonly src: gs.Rem_JoinData<"variant">
    readonly ignore: RemClone_Variant_Params_Ignore
    readonly overrides: RemClone_Variant_Params_Overries
}

export const remclone_variant = function(
    params: RemClone_VariantNode_Params
): capi.SendRest_DataPost_Body<"variant">[number] {
    const variant_id = params.overrides.variant_id ?? uuid()
    const prodset_id = params.overrides.prodset_id ?? uuid()

    return {
        core: {
            id: variant_id,

            owner: params.overrides.owner,
            status_hidden: params.src.status_hidden,
            header: params.overrides.variant_header ?? params.src.header,
            description: params.overrides.variant_description ?? params.src.description,

            item__id: params.overrides.item_id ?? params.src.item__id,
            prodset__id: params.ignore.prodset ? params.src.prodset__id : prodset_id,
        },

        joins: {
            tl: (params.overrides.tl
                ? params.overrides.tl.map(rawtl => {
                    return {
                        core: {
                            id: uuid(),

                            source__id: variant_id,
                            owner: params.overrides.owner,

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

                            source__id: variant_id,
                            owner: params.overrides.owner,

                            lang: tl.lang,
                            tltable: tl.tltable,
                        },

                        joins: {},
                    }
                })
            ),

            prodset: params.ignore.prodset ? null : {
                core: {
                    id: prodset_id,
                    owner: params.overrides.owner,
                },

                joins: {
                    products: params.src.prodset.products.map(product => {
                        return remclone_product_node({
                            src: product,

                            overrides: {
                                prodset_id,
                                owner: params.overrides.owner,
                                material_map: params.overrides.materialmap,
                            },
                        })
                    })
                },
            },
        },
    }
}
