import * as cc from "@fst/config/client"
import type * as rest from "@fst/rest"
import * as asc from "@qyu/atom-state-core"
import type { Rem_Result } from "@src/rem/type/result"

const comparator_struct = function(a: {}, b: {}): boolean {
    for (const key of Object.keys(a)) {
        if (!Object.is(a[key as keyof {}], b[key as keyof {}])) {
            return false
        }
    }

    return true
}

export const nrem_dbslice_use = function(rem: Rem_Result, slice: rest.Database_Slice): asc.AtomAction {
    return ({ reg }) => {
        for (const [table_name, table_slice] of Object.entries(slice)) {
            if (table_slice) {
                for (const table_node of table_slice.nodes) {
                    const remnode = reg(rem[table_name as "item"].register).reg({ id: table_node.id, })
                    const real_o = remnode.real.output()

                    if (real_o.status !== asc.ReqState__Status.Fulfilled || !comparator_struct(real_o.data, table_node)) {
                        remnode.real.input(asc.reqstate_new_fulfilled(
                            table_node as cc.RemDef["item"]["data"]
                        ))
                    }
                }
            }
        }
    }
}
