import * as asc from "@qyu/atom-state-core"
import * as sc from "@qyu/signal-core"

export type AtomRemNode_Join_Prop_Optional_Params<Param, TParam, Result> = {
    readonly mode_loose?: boolean

    readonly transformer: (param: Param) => TParam | undefined
    readonly source: asc.AtomRemNode_Join_Factory<TParam, Result>
}

export const atomremnode_join_prop_optional = function <Param, TParam, Result>(
    params: AtomRemNode_Join_Prop_Optional_Params<Param, TParam, Result>
): asc.AtomRemNode_Join_Factory<sc.OSignal<Param | null>, Result | undefined> {
    const nparam_mode_loose = params.mode_loose ?? false

    return ({ reg }) => {
        return key => {
            return sc.osignal_new_memo(sc.osignal_new_pipeflat(key, key_o => {
                if (key_o === null) {
                    return null
                }

                if (key_o === undefined) {
                    return undefined
                }

                const transformed = params.transformer(key_o)

                if (transformed === undefined || (transformed === null && nparam_mode_loose)) {
                    return undefined
                }

                return reg(params.source)(transformed)
            }))
        }
    }
}
