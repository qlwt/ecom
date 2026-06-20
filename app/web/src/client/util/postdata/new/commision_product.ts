import * as capi from "@fst/capi"
import * as cst from "@fst/cst"
import * as dbdef from "@fst/db-default"
import * as gs from "@fst/gstate"
import { array_new_mapfilter } from "@src/client/util/array/new/mapfilter"
import { object_new_prefix } from "@src/client/util/object/new/prefix"
import { tl_new_merge } from "@src/client/util/tl/new/merge"
import { v7 as uuid } from "uuid"

export type PostBody_NewCommisionProduct_Src = {
    readonly id: string
    readonly commision_node_id: string
    readonly product: gs.Rem_JoinData<"product">
}

export type PostBody_NewCommisionProduct_Overrides = {
    readonly owner: string | null
}

export type PostBody_NewCommisionProduct_Params = {
    readonly src: PostBody_NewCommisionProduct_Src
    readonly overrides: PostBody_NewCommisionProduct_Overrides
}

export const postbody_new_commision_product = function(
    params: PostBody_NewCommisionProduct_Params
): capi.SendRest_DataPost_Body<"commision_product">[number] {
    const src_product = params.src.product
    const src_template = src_product.template
    const src_args = params.src.product.template.args

    return {
        core: {
            ...dbdef.table.commision_product,

            id: params.src.id,

            owner: params.overrides.owner,
            quantity: src_product.quantity,
            price_formula: src_template.price_formula,

            tmplpr__id: src_template.id,
            tmplpr_name: src_template.name,

            commision_node__id: params.src.commision_node_id,
        },

        joins: {
            tl: src_template.tl.map(tl => {
                return {
                    lang: tl.lang,
                    tltable: object_new_prefix(tl.tltable, "tmplpr_")
                }
            }).map(tldef => {
                return {
                    core: {
                        ...dbdef.table.commision_product_tl,

                        id: uuid(),
                        owner: params.overrides.owner,
                        source__id: params.src.id,

                        lang: tldef.lang,
                        tltable: tldef.tltable,
                    },

                    joins: {},
                }
            }),

            refimgs: src_template.refimgs.map(refimg => {
                return {
                    core: {
                        id: uuid(),
                        img__id: refimg.img__id,
                        owner: params.overrides.owner,
                        commision_product__id: params.src.id,
                    },

                    joins: {},
                }
            }),

            args_bool: array_new_mapfilter(src_args, arg => {
                const arg_bool = arg.defs_bool[0]

                if (arg.kind === cst.TmplPrArg_Kind.Bool && arg_bool) {
                    const imp_bool = params.src.product.argimps_bool.find(imp => {
                        return imp.tmplpr_arg_bool__id === arg_bool.id
                    }) ?? null

                    const comarg_id = uuid()

                    return {
                        core: {
                            id: comarg_id,
                            commision_product__id: params.src.id,

                            name: arg.name,
                            owner: params.overrides.owner,
                            title_true: arg_bool.title_true,
                            title_false: arg_bool.title_false,
                            hidden_formula: arg.hidden_formula,
                            value: imp_bool?.value ?? arg_bool.value_def,
                        },

                        joins: {
                            tl: tl_new_merge([arg.tl, arg_bool.tl]).map(tlnode => ({
                                core: {
                                    ...dbdef.table.commision_product_argbool_tl,

                                    id: uuid(),
                                    source__id: comarg_id,

                                    lang: tlnode.lang,
                                    tltable: tlnode.tltable,
                                    owner: params.overrides.owner,
                                },

                                joins: {},
                            })),
                        },
                    }
                }

                return null
            }),

            args_line: array_new_mapfilter(src_args, arg => {
                const arg_line = arg.defs_line[0]

                if (arg.kind === cst.TmplPrArg_Kind.Line && arg_line) {
                    const imp_line = params.src.product.argimps_line.find(imp => {
                        return imp.tmplpr_arg_line__id === arg_line.id
                    }) ?? null

                    const comarg_id = uuid()

                    return {
                        core: {
                            id: comarg_id,
                            commision_product__id: params.src.id,

                            name: arg.name,
                            owner: params.overrides.owner,
                            hidden_formula: arg.hidden_formula,
                            x_value: imp_line?.x_value ?? arg_line.x_value_def,
                        },

                        joins: {
                            tl: arg.tl.map(tlnode => ({
                                core: {
                                    ...dbdef.table.commision_product_argbool_tl,

                                    id: uuid(),
                                    source__id: comarg_id,

                                    lang: tlnode.lang,
                                    tltable: tlnode.tltable,
                                    owner: params.overrides.owner,
                                },

                                joins: {},
                            })),
                        },
                    }
                }

                return null
            }),

            args_rect: array_new_mapfilter(src_args, arg => {
                const arg_rect = arg.defs_rect[0]

                if (arg.kind === cst.TmplPrArg_Kind.Rect && arg_rect) {
                    const imp_rect = params.src.product.argimps_rect.find(imp => {
                        return imp.tmplpr_arg_rect__id === arg_rect.id
                    }) ?? null

                    const comarg_id = uuid()

                    return {
                        core: {
                            id: comarg_id,
                            commision_product__id: params.src.id,

                            name: arg.name,
                            owner: params.overrides.owner,
                            hidden_formula: arg.hidden_formula,
                            x_value: imp_rect?.x_value ?? arg_rect.x_value_def,
                            y_value: imp_rect?.y_value ?? arg_rect.y_value_def,
                        },

                        joins: {
                            tl: arg.tl.map(tlnode => ({
                                core: {
                                    ...dbdef.table.commision_product_argbool_tl,

                                    id: uuid(),
                                    source__id: comarg_id,

                                    lang: tlnode.lang,
                                    tltable: tlnode.tltable,
                                    owner: params.overrides.owner,
                                },

                                joins: {},
                            })),
                        },
                    }
                }

                return null
            }),

            args_mat: array_new_mapfilter(src_args, arg => {
                const arg_mat = arg.defs_mat[0]

                if (arg.kind === cst.TmplPrArg_Kind.Mat && arg_mat) {
                    const imp_mat = params.src.product.argimps_mat.find(imp => {
                        return imp.tmplpr_arg_mat__id === arg_mat.id
                    }) ?? null

                    const comarg_id = uuid()

                    return {
                        core: {
                            id: comarg_id,
                            owner: params.overrides.owner,
                            commision_product__id: params.src.id,

                            name: arg.name,
                            hidden_formula: arg.hidden_formula,

                            material__id: imp_mat?.value?.id ?? null,

                            tmplmt__id: imp_mat?.value?.template.id ?? null,
                            tmplmt_name: imp_mat?.value?.template.name ?? "",
                        },

                        joins: {
                            tl: tl_new_merge([
                                arg.tl,
                                (imp_mat?.value?.template.tl ?? []).map(tlraw => {
                                    return {
                                        lang: tlraw.lang,
                                        tltable: object_new_prefix(tlraw.tltable, "tmplmt_")
                                    }
                                })
                            ]).map(tlnode => ({
                                core: {
                                    ...dbdef.table.commision_product_argbool_tl,

                                    id: uuid(),

                                    source__id: comarg_id,
                                    owner: params.overrides.owner,

                                    lang: tlnode.lang,
                                    tltable: tlnode.tltable,
                                },

                                joins: {},
                            })),

                            refimgs: (imp_mat?.value?.template.refimgs ?? []).map(refimg => {
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
                }

                return null
            }),
        },
    }
}
