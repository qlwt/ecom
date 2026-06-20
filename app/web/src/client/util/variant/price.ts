import * as cc from "@fst/config/client"
import * as sxm from "@fst/syntax-math"
import * as sx from "@qyu/syntax-core"
import { formula_price_new_prodset } from "@src/client/util/formula_price/new/prodset"

export type Variant_PriceNew_Params = {
    readonly variant: cc.RemDef["variant"]["joins"]["core"]
    readonly cache_expr?: Map<string, sx.Tree_Slot<sxm.TreeNode>>
}

export const variant_price_new = function(params: Variant_PriceNew_Params): number {
    return formula_price_new_prodset({
        ...params,

        prodset: params.variant.prodset,
    })
}
