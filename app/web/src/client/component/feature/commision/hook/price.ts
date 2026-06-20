import * as gs from "@fst/gstate"
import { formula_price_new_commision_node } from "@src/client/util/formula_price/new/commision_node"
import * as r from "react"

export type UseEFCommisionPrice_Params<Ref> = {
    readonly cache_price: WeakMap<{}, number>

    readonly ref_list: readonly Ref[] | null
    readonly ref_pick_quantity: (ref: Ref) => number
    readonly ref_pick_node: (ref: Ref) => gs.Rem_JoinData<"commision_node">
}

export const useEFCommisionPrice = function <Ref>(params: UseEFCommisionPrice_Params<Ref>) {
    return r.useMemo(() => {
        if (!params.ref_list) {
            return 0
        }

        let total = 0

        for (const refnode of params.ref_list) {
            const node = params.ref_pick_node(refnode)

            let prodset_price = params.cache_price.get(node)

            if (prodset_price === undefined) {
                prodset_price = (
                    params.ref_pick_quantity(refnode)
                    * formula_price_new_commision_node({ commision_node: node })
                )

                params.cache_price.set(node, prodset_price)
            }

            total += prodset_price
        }

        return total
    }, [params.ref_list, params.cache_price])
}
