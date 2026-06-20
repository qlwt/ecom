import * as capi from "@fst/capi"
import * as gs from "@fst/gstate"
import { v7 as uuid } from "uuid"

export type RemClone_Product_MaterialMap = {
    readonly [ID in string]: string
}

export type RemClone_Product_Params_Overries = {
    readonly owner: string | null

    readonly product_id?: string
    readonly prodset_id?: string
    readonly material_map?: RemClone_Product_MaterialMap
}

export type RemClone_ProductNode_Params = {
    readonly src: gs.Rem_JoinData<"product">
    readonly overrides: RemClone_Product_Params_Overries
}

export const remclone_product_node = function(
    params: RemClone_ProductNode_Params
): capi.SendRest_DataPost_Body<"product">[number] {
    type Joins = capi.SendRest_DataPost_Body<"product">[number]["joins"]

    const product_id = params.overrides.product_id ?? uuid()

    return {
        core: {
            id: product_id,

            quantity: params.src.quantity,
            owner: params.overrides.owner,
            tmplpr__id: params.src.tmplpr__id,
            prodset__id: params.overrides.prodset_id ?? params.src.prodset__id,
        },

        joins: {
            argimps_bool: params.src.template.args.map(arg => {
                return arg.defs_bool.map(argbool => {
                    const imp = params.src.argimps_bool.find(
                        imp => imp.tmplpr_arg_bool__id === argbool.id
                    ) ?? null

                    return {
                        core: {
                            id: uuid(),
                            product__id: product_id,
                            owner: params.overrides.owner,
                            tmplpr_arg_bool__id: argbool.id,
                            value: imp?.value ?? argbool.value_def,
                        },

                        joins: {},
                    } satisfies NonNullable<Joins["argimps_bool"]>[number]
                })
            }).flat(1),

            argimps_line: params.src.template.args.map(arg => {
                return arg.defs_line.map(argline => {
                    const imp = params.src.argimps_line.find(
                        imp => imp.tmplpr_arg_line__id === argline.id
                    ) ?? null

                    return {
                        core: {
                            id: uuid(),
                            product__id: product_id,
                            owner: params.overrides.owner,
                            tmplpr_arg_line__id: argline.id,
                            x_value: imp?.x_value ?? argline.x_value_def,
                        },

                        joins: {},
                    } satisfies NonNullable<Joins["argimps_line"]>[number]
                })
            }).flat(1),

            argimps_rect: params.src.template.args.map(arg => {
                return arg.defs_rect.map(argrect => {
                    const imp = params.src.argimps_rect.find(
                        imp => imp.tmplpr_arg_rect__id === argrect.id
                    ) ?? null

                    return {
                        core: {
                            id: uuid(),
                            product__id: product_id,
                            owner: params.overrides.owner,
                            tmplpr_arg_rect__id: argrect.id,
                            x_value: imp?.x_value ?? argrect.x_value_def,
                            y_value: imp?.y_value ?? argrect.y_value_def,
                        },

                        joins: {},
                    } satisfies NonNullable<Joins["argimps_rect"]>[number]
                })
            }).flat(1),

            argimps_mat: params.src.template.args.map(arg => {
                return arg.defs_mat.map(argmat => {
                    const imp = params.src.argimps_mat.find(
                        imp => imp.tmplpr_arg_mat__id === argmat.id
                    ) ?? null

                    let value: string | null = imp?.value?.id ?? null

                    if (value !== null && params.overrides.material_map) {
                        const value_replacement = params.overrides.material_map[value]

                        if (typeof value_replacement === "string") {
                            value = value_replacement
                        }
                    }

                    return {
                        core: {
                            id: uuid(),
                            value: value ?? null,
                            product__id: product_id,
                            owner: params.overrides.owner,
                            tmplpr_arg_mat__id: argmat.id,
                        },

                        joins: {},
                    } satisfies NonNullable<Joins["argimps_mat"]>[number]
                })
            }).flat(1),
        },
    }
}
