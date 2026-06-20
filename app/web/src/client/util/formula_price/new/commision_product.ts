import * as cc from "@fst/config/client"
import * as sxm from "@fst/syntax-math"
import * as sx from "@qyu/syntax-core"

export type FormulaPrice_NewCommisionProduct_Params = {
    readonly cache_expr?: Map<string, sx.Tree_Slot<sxm.TreeNode>>
    readonly product: cc.RemDef["commision_product"]["joins"]["core"]
}

export const formula_price_new_commision_product = function(params: FormulaPrice_NewCommisionProduct_Params): number {
    const { product, cache_expr } = params

    const vars: Record<string, number> = {}

    for (const arg_line of product.args_line) {
        vars[`${arg_line.name}_x`] = arg_line.x_value
    }

    for (const arg_rect of product.args_rect) {
        vars[`${arg_rect.name}_x`] = arg_rect.x_value
        vars[`${arg_rect.name}_y`] = arg_rect.y_value
    }

    for (const arg_bool of product.args_bool) {
        vars[`${arg_bool.name}`] = arg_bool.value
    }

    let expr: sx.Tree_Slot<sxm.TreeNode> | undefined = undefined

    if (cache_expr) {
        expr = cache_expr.get(product.price_formula)

        if (!expr) {
            expr = sxm.expr_prepare_safe(product.price_formula)

            if (!expr) {
                return 0
            }

            cache_expr.set(product.price_formula, expr)
        }
    } else {
        expr = sxm.expr_prepare_safe(product.price_formula)

        if (!expr) {
            return 0
        }
    }

    return (
        product.quantity
        * (sxm.ast_reduce_safe(expr, sxm.config_base({ vars })) ?? 0)
    )
}
