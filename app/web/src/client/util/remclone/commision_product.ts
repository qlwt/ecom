import * as capi from "@fst/capi"
import * as gs from "@fst/gstate"
import { v7 as uuid } from "uuid"

export type RemClone_CommisionProduct_Params_Overries = {
    readonly owner: string | null
    readonly commision_node_id?: string
    readonly commision_product_id?: string
}

export type RemClone_CommisionProductNode_Params = {
    readonly src: gs.Rem_JoinData<"commision_product">
    readonly overrides: RemClone_CommisionProduct_Params_Overries
}

export const remclone_commision_product = function(
    params: RemClone_CommisionProductNode_Params
): capi.SendRest_DataPost_Body<"commision_product">[number] {
    const product_id = params.overrides.commision_product_id ?? uuid()

    return {
        core: {
            id: product_id,
            commision_node__id: params.overrides.commision_node_id ?? params.src.commision_node__id,

            quantity: params.src.quantity,
            price_formula: params.src.price_formula,

            owner: params.overrides.owner,
            tmplpr__id: params.src.tmplpr__id,
            tmplpr_name: params.src.tmplpr_name,
        },

        joins: {
            tl: params.src.tl.map(tldef => {
                return {
                    core: {
                        id: uuid(),
                        source__id: product_id,
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
                        img__id: refimg.img__id,
                        owner: params.overrides.owner,
                        commision_product__id: product_id,
                    },

                    joins: {},
                }
            }),

            args_bool: params.src.args_bool.map(arg => {
                const comarg_id = uuid()

                return {
                    core: {
                        id: comarg_id,
                        commision_product__id: product_id,

                        name: arg.name,
                        value: arg.value,
                        title_true: arg.title_true,
                        title_false: arg.title_false,
                        owner: params.overrides.owner,
                        hidden_formula: arg.hidden_formula,
                    },

                    joins: {
                        tl: arg.tl.map(tlnode => ({
                            core: {
                                id: uuid(),

                                source__id: comarg_id,
                                owner: params.overrides.owner,

                                lang: tlnode.lang,
                                tltable: tlnode.tltable,
                            },

                            joins: {},
                        })),
                    }
                }
            }),

            args_line: params.src.args_line.map(arg => {
                const comarg_id = uuid()

                return {
                    core: {
                        id: comarg_id,
                        commision_product__id: product_id,

                        name: arg.name,
                        x_value: arg.x_value,
                        owner: params.overrides.owner,
                        hidden_formula: arg.hidden_formula,
                    },

                    joins: {
                        tl: arg.tl.map(tlnode => ({
                            core: {
                                id: uuid(),

                                source__id: comarg_id,
                                owner: params.overrides.owner,

                                lang: tlnode.lang,
                                tltable: tlnode.tltable,
                            },

                            joins: {},
                        })),
                    },
                }
            }),

            args_rect: params.src.args_rect.map(arg => {
                const comarg_id = uuid()

                return {
                    core: {
                        id: comarg_id,
                        commision_product__id: product_id,

                        name: arg.name,
                        x_value: arg.x_value,
                        y_value: arg.y_value,
                        owner: params.overrides.owner,
                        hidden_formula: arg.hidden_formula,
                    },

                    joins: {
                        tl: arg.tl.map(tlnode => ({
                            core: {
                                id: uuid(),

                                source__id: comarg_id,
                                owner: params.overrides.owner,

                                lang: tlnode.lang,
                                tltable: tlnode.tltable,
                            },

                            joins: {},
                        })),
                    },
                }
            }),

            args_mat: params.src.args_mat.map(arg => {
                const comarg_id = uuid()

                return {
                    core: {
                        id: comarg_id,
                        commision_product__id: product_id,

                        name: arg.name,
                        owner: params.overrides.owner,
                        material__id: arg.material__id,
                        tmplmt__id: arg.tmplmt__id,
                        tmplmt_name: arg.tmplmt_name,
                        hidden_formula: arg.hidden_formula,
                    },

                    joins: {
                        tl: arg.tl.map(tlnode => ({
                            core: {
                                id: uuid(),

                                source__id: comarg_id,
                                owner: params.overrides.owner,

                                lang: tlnode.lang,
                                tltable: tlnode.tltable,
                            },

                            joins: {},
                        })),

                        refimgs: arg.refimgs.map(refimg => {
                            return {
                                core: {
                                    id: uuid(),

                                    img__id: refimg.img__id,
                                    owner: params.overrides.owner,
                                    commision_product_argmat__id: comarg_id,
                                },

                                joins: {},
                            }
                        }),
                    },
                }
            }),
        },
    }
}
