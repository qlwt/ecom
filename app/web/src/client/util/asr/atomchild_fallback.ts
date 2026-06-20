import * as asc from "@qyu/atom-state-core"
import * as asr from "@qyu/atom-state-react"
import * as r from "react"

export type UseAtomChildFallback_Params<Index, V> = {
    readonly param: Index | null
    readonly family: asc.AtomFamily<Index, V>
}

export const useAtomChildFallback = function <Index, V>(params: UseAtomChildFallback_Params<Index, V>): V | null {
    const store = asr.useAtomStore()

    return r.useMemo(() => {
        if (params.param === null) {
            return null
        }

        return store.reg(params.family).reg(params.param)
    }, [params.param, params.family])
}
