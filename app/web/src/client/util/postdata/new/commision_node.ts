import * as capi from "@fst/capi"
import * as dbdef from "@fst/db-default"
import * as gs from "@fst/gstate"
import { object_new_prefix } from "@src/client/util/object/new/prefix"
import { postbody_new_commision_product } from "@src/client/util/postdata/new/commision_product"
import { tl_new_merge } from "@src/client/util/tl/new/merge"
import { v7 as uuid } from "uuid"

export type PostBody_NewCommisionNode_Src = {
    readonly id: string
    readonly prodset: gs.Rem_JoinData<"prodset">

    readonly item_id: string
    readonly item_name: string
    readonly item_tl: readonly gs.Rem_JoinData<"item_tl">[]
    readonly item_refimgs: readonly gs.Rem_JoinData<"item_refimg">[]

    readonly tmplit_id: string
    readonly tmplit_name: string
    readonly tmplit_tl: readonly gs.Rem_JoinData<"tmplit_tl">[]

    readonly variant_id: string
    readonly variant_header: string
    readonly variant_tl: readonly gs.Rem_JoinData<"variant_tl">[]
}

export type PostBody_NewCommisionNode_Overrides = {
    readonly owner: string | null
}

export type PostBody_NewCommisionNode_Params = {
    readonly src: PostBody_NewCommisionNode_Src
    readonly overrides: PostBody_NewCommisionNode_Overrides
}

export const postbody_new_commision_node = function(
    params: PostBody_NewCommisionNode_Params
): capi.SendRest_DataPost_Body<"commision_node">[number] {
    return {
        core: {
            ...dbdef.table.commision_node,

            id: params.src.id,
            owner: params.overrides.owner,

            item__id: params.src.item_id,
            item_name: params.src.item_name,

            tmplit__id: params.src.tmplit_id,
            tmplit_name: params.src.tmplit_name,

            variant__id: params.src.variant_id,
            variant_header: params.src.variant_header,
        },

        joins: {
            tl: tl_new_merge([
                params.src.item_tl.map(tl => {
                    return {
                        lang: tl.lang,
                        tltable: object_new_prefix(tl.tltable, "item_")
                    }
                }),

                params.src.tmplit_tl.map(tl => {
                    return {
                        lang: tl.lang,
                        tltable: object_new_prefix(tl.tltable, "tmplit_")
                    }
                }),

                params.src.variant_tl.map(tl => {
                    return {
                        lang: tl.lang,
                        tltable: object_new_prefix(tl.tltable, "variant_")
                    }
                }),
            ]).map(tldef => {
                return {
                    core: {
                        ...dbdef.table.commision_node_tl,

                        id: uuid(),
                        source__id: params.src.id,

                        lang: tldef.lang,
                        tltable: tldef.tltable,
                        owner: params.overrides.owner,
                    },

                    joins: {},
                }
            }),

            refimgs: params.src.item_refimgs.map(refimg => {
                return {
                    core: {
                        ...dbdef.table.commision_node_refimg,

                        id: uuid(),
                        img__id: refimg.img__id,
                        owner: params.overrides.owner,
                        commision_node__id: params.src.id,
                    },

                    joins: {},
                }
            }),

            products: params.src.prodset.products.map(product => {
                return postbody_new_commision_product({
                    src: {
                        id: uuid(),

                        product,
                        commision_node_id: params.src.id,
                    },

                    overrides: {
                        owner: params.overrides.owner,
                    }
                })
            })
        },
    }
}
