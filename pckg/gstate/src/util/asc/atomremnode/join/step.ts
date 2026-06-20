import * as sc from "@qyu/signal-core"
import * as asc from "@qyu/atom-state-core"

type Output<T extends { readonly data: any } | undefined | null> = (
    | (T extends undefined ? undefined : never)
    | (T extends { readonly data: infer D } ? Exclude<D, null> : never)
)

export const atomremnode_join_step = function <Param, Result extends { readonly data: any } | undefined>(
    source: asc.AtomRemNode_Join_Factory<Param, Result | null>
): asc.AtomRemNode_Join_Factory<Param, Output<Result>> {
    return ({ reg }) => {
        return key => {
            const a = reg(source)(key)

            return sc.osignal_new_pipe(a, a_o => {
                if (a_o === null) { return null }
                if (a_o === undefined) { return undefined }
                if (a_o.data === null) { return null }
                if (a_o.data.deleted === 1) { return null }

                return a_o.data
            })
        }
    }
}
