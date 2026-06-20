import * as cc from "@fst/config/client"
import * as sxm from "@fst/syntax-math"
import * as sx from "@qyu/syntax-core"
import { formula_price_new_commision_product } from "@src/client/util/formula_price/new/commision_product"

export type FormulaPrice_NewCommisionNode_Params = {
    readonly commision_node: cc.RemDef["commision_node"]["joins"]["core"]
    readonly cache_expr?: Map<string, sx.Tree_Slot<sxm.TreeNode>>
}

export const formula_price_new_commision_node = function(params: FormulaPrice_NewCommisionNode_Params): number {
    const { commision_node, cache_expr } = params

    let total = 0

    for (const product of commision_node.products) {
        total += formula_price_new_commision_product({ product, cache_expr })
    }

    return total
}
