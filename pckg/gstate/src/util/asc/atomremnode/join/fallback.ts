import * as asc from "@qyu/atom-state-core"
import * as sc from "@qyu/signal-core"

export type AtomRemNode_Join_Fallback_Params<Param, Fallback, Result> = {
    readonly fallback: Fallback
    readonly source: asc.AtomRemNode_Join_Factory<sc.OSignal<Param | null>, Result>
}

export const atomremnode_join_fallback = function <Param, Fallback, Result>(
    params: AtomRemNode_Join_Fallback_Params<Param, Fallback, Result>
): asc.AtomRemNode_Join_Factory<sc.OSignal<Param | null>, Result | Fallback> {
    return ({ reg }) => {
        return key => {
            return sc.osignal_new_pipe(
                reg(params.source)(key),
                result => {
                    if (result === null) {
                        return params.fallback
                    }

                    return result
                }
            )
        }
    }
}

