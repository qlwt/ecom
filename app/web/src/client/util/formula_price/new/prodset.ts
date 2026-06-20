import * as cc from "@fst/config/client"
import * as sxm from "@fst/syntax-math"
import * as sx from "@qyu/syntax-core"
import { formula_price_new_product } from "@src/client/util/formula_price/new/product"

export type FormulaPrice_NewProdSet_Params = {
    readonly prodset: cc.RemDef["prodset"]["joins"]["core"]
    readonly cache_expr?: Map<string, sx.Tree_Slot<sxm.TreeNode>>
}

export const formula_price_new_prodset = function(params: FormulaPrice_NewProdSet_Params): number {
    const { prodset, cache_expr } = params

    let total = 0

    for (const product of prodset.products) {
        total += formula_price_new_product({ product, cache_expr })
    }

    return total
}
