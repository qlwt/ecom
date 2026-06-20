import * as cc from "@fst/config/client"

export type EFCommision__NodeUnavailable_Params = {
    readonly mode_strict: boolean
    readonly cache_unavailable: WeakMap<{}, boolean>
    readonly node: cc.RemDef["commision_node"]["joins"]["core"]
}

export const efcommision__node_unavailable = function(params: EFCommision__NodeUnavailable_Params): boolean {
    const status_unavailable = params.cache_unavailable.get(params.node)

    if (typeof status_unavailable === "boolean") {
        return status_unavailable
    }

    {
        for (const product of params.node.products) {
            for (const argmat of product.args_mat) {
                if (
                    argmat.material === undefined
                    || argmat.material.status_available === 0
                    || (params.mode_strict && argmat.material.status_hidden === 0)
                ) {
                    params.cache_unavailable.set(params.node, true)

                    return true
                }
            }
        }

        params.cache_unavailable.set(params.node, false)
    }

    return false
}
