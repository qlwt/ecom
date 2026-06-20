import * as asc from "@qyu/atom-state-core"
import * as asr from "@qyu/atom-state-react"
import * as sc from "@qyu/signal-core"
import * as sr from "@qyu/signal-react"
import * as r from "react"

export const useRemData = function <RemDef extends asc.AtomRemNode_Def>(
    src: asc.AtomRemNode_Value<RemDef> | null
): RemDef["data"] | null {
    const { reg } = asr.useAtomStore()

    const data_s = r.useMemo(() => {
        if (src) {
            return sc.osignal_new_memo(
                sc.osignal_new_pipe(
                    reg(asc.atomremnode_data({ remnode: () => src, })),
                    remview => remview.data,
                ),
                null
            )
        }

        return null
    }, [src])

    return sr.useSignalOutputFallback(null, { src: data_s, })
}
