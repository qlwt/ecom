import * as cc from "@fst/config/client"
import * as sxm from "@fst/syntax-math"
import * as sx from "@qyu/syntax-core"

export type FormulaHidden_NewCommisionArg_Params = {
    readonly formula_raw: string
    readonly cache_expr?: Map<string, sx.Tree_Slot<sxm.TreeNode>>
    readonly product: cc.RemDef["commision_product"]["joins"]["core"]
}

export const formula_hidden_new_commision_arg = function(params: FormulaHidden_NewCommisionArg_Params): boolean {
    const { formula_raw, product, cache_expr } = params

    const formula = formula_raw.trim()
    const vars: Record<string, number> = {}

    if (formula.length === 0) {
        return false
    }

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
        expr = cache_expr.get(formula)

        if (!expr) {
            expr = sxm.expr_prepare_safe(formula)

            if (!expr) {
                return false
            }

            cache_expr.set(formula, expr)
        }
    } else {
        expr = sxm.expr_prepare_safe(formula)

        if (!expr) {
            return false
        }
    }

    return Boolean(sxm.ast_reduce_safe(expr, sxm.config_base({ vars })) ?? 0)
}
