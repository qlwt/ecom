import * as cc from "@fst/config/client"
import * as cst from "@fst/cst"
import * as sxm from "@fst/syntax-math"
import * as sx from "@qyu/syntax-core"

export type FormulaPrice_NewProduct_Params = {
    readonly product: cc.RemDef["product"]["joins"]["core"]
    readonly cache_expr?: Map<string, sx.Tree_Slot<sxm.TreeNode>>
}

export const formula_price_new_product = function(params: FormulaPrice_NewProduct_Params): number {
    const { product, cache_expr } = params

    const vars: Record<string, number> = {}

    const tmplmap = new Map<string, cc.RemDef["tmplpr_arg"]["joins"]["core"]>

    for (const tmplpr_arg of product.template.args) {
        switch (tmplpr_arg.kind) {
            case cst.TmplPrArg_Kind.Line: {
                const def = tmplpr_arg.defs_line[0]

                if (def) {
                    tmplmap.set(def.id, tmplpr_arg)

                    vars[`${tmplpr_arg.name}_x`] = def.x_value_def
                }

                break
            }
            case cst.TmplPrArg_Kind.Rect: {
                const def = tmplpr_arg.defs_rect[0]

                if (def) {
                    tmplmap.set(def.id, tmplpr_arg)

                    vars[`${tmplpr_arg.name}_x`] = def.x_value_def
                    vars[`${tmplpr_arg.name}_y`] = def.y_value_def
                }

                break
            }
            case cst.TmplPrArg_Kind.Bool: {
                const def = tmplpr_arg.defs_bool[0]

                if (def) {
                    tmplmap.set(def.id, tmplpr_arg)

                    vars[`${tmplpr_arg.name}`] = def.value_def
                }

                break
            }
        }
    }

    for (const arg_line of product.argimps_line) {
        const tmplpr_arg = tmplmap.get(arg_line.tmplpr_arg_line__id)

        if (tmplpr_arg) {
            vars[`${tmplpr_arg.name}_x`] = arg_line.x_value
        }
    }

    for (const arg_rect of product.argimps_rect) {
        const tmplpr_arg = tmplmap.get(arg_rect.tmplpr_arg_rect__id)

        if (tmplpr_arg) {
            vars[`${tmplpr_arg.name}_x`] = arg_rect.x_value
            vars[`${tmplpr_arg.name}_y`] = arg_rect.y_value
        }
    }

    for (const arg_bool of product.argimps_bool) {
        const tmplpr_arg = tmplmap.get(arg_bool.tmplpr_arg_bool__id)

        if (tmplpr_arg) {
            vars[`${tmplpr_arg.name}`] = arg_bool.value
        }
    }

    let expr: sx.Tree_Slot<sxm.TreeNode> | undefined = undefined

    if (cache_expr) {
        expr = cache_expr.get(product.template.price_formula)

        if (!expr) {
            expr = sxm.expr_prepare_safe(product.template.price_formula)

            if (!expr) {
                return 0
            }

            cache_expr.set(product.template.price_formula, expr)
        }
    } else {
        expr = sxm.expr_prepare_safe(product.template.price_formula)

        if (!expr) {
            return 0
        }
    }

    return (
        product.quantity
        * (sxm.ast_reduce_safe(expr, sxm.config_base({ vars })) ?? 0)
    )
}
