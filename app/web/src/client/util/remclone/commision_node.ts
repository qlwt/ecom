import * as capi from "@fst/capi"
import * as gs from "@fst/gstate"
import { remclone_commision_product } from "@src/client/util/remclone/commision_product"
import { v7 as uuid } from "uuid"

export type RemClone_CommisionNode_Params_Overries = {
    readonly owner: string | null
    readonly commision_node_id?: string
}

export type RemClone_CommisionNodeNode_Params = {
    readonly src: gs.Rem_JoinData<"commision_node">
    readonly overrides: RemClone_CommisionNode_Params_Overries
}

export const remclone_commision_node = function(
    params: RemClone_CommisionNodeNode_Params
): capi.SendRest_DataPost_Body<"commision_node">[number] {
    const node_id = params.overrides.commision_node_id ?? uuid()

    return {
        core: {
            id: node_id,

            owner: params.overrides.owner,

            item__id: params.src.item__id,
            item_name: params.src.item_name,

            tmplit__id: params.src.tmplit__id,
            tmplit_name: params.src.tmplit_name,

            variant__id: params.src.variant__id,
            variant_header: params.src.variant_header,
        },

        joins: {
            tl: params.src.tl.map(tldef => {
                return {
                    core: {
                        id: uuid(),
                        source__id: node_id,
                        owner: params.overrides.owner,

                        lang: tldef.lang,
                        tltable: tldef.tltable,
                    },

                    joins: {},
                }
            }),

            refimgs: params.src.refimgs.map(refimg => {
                return {
                    core: {
                        id: uuid(),

                        owner: params.overrides.owner,

                        img__id: refimg.img__id,
                        commision_node__id: node_id,
                    },

                    joins: {},
                }
            }),

            products: params.src.products.map(product => {
                return remclone_commision_product({
                    src: product,

                    overrides: {
                        ...params.overrides,

                        commision_node_id: node_id,
                    },
                })
            }),
        },
    }
}
