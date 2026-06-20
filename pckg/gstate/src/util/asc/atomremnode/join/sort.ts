import * as sc from "@qyu/signal-core"
import * as asc from "@qyu/atom-state-core"

export const atomremnode_join_sort = function <Param, Result extends any[]>(
    source: asc.AtomRemNode_Join_Factory<Param, Result | null>,
    sorter: (a: Result[number], b: Result[number]) => number
): asc.AtomRemNode_Join_Factory<Param, Result> {
    return ({ reg }) => {
        return key => {
            const a = reg(source)(key)

            return sc.osignal_new_pipe(a, a_o => {
                if (a_o === null) { return null }

                return a_o.sort(sorter)
            })
        }
    }
}
