import * as gs from "@fst/gstate"
import { formula_price_new_commision_node } from "@src/client/util/formula_price/new/commision_node"
import * as r from "react"

export type UseEPCardCommisionPrice_Params = {
    readonly cache_price: WeakMap<{}, number>
    readonly cart: readonly gs.Rem_JoinData<"commision_node">[] | null
}

export const useEPCardCommisionPrice = function(params: UseEPCardCommisionPrice_Params) {
    const { cart, cache_price } = params

    return r.useMemo(() => {
        if (!params.cart) {
            return 0
        }

        let total = 0

        for (const node of params.cart) {
            if (node) {
                let prodset_price = cache_price.get(node)

                if (prodset_price === undefined) {
                    prodset_price = formula_price_new_commision_node({ commision_node: node })

                    cache_price.set(node, prodset_price)
                }

                total += prodset_price
            }
        }

        return total
    }, [cart, cache_price])
}
