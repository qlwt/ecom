import * as r from "react"
import * as sc from "@qyu/signal-core"

export const useSignalOutputFallback = function <O, F>(src: sc.OSignal<O> | null, fallback: F): O | F {
    const src_memo = r.useMemo(() => src ? sc.osignal_new_memo(src, null) : null, [src])
    const [state, state_set] = r.useState<O | F>(() => src_memo?.output() ?? fallback)

    r.useEffect((): VoidFunction | void => {
        if (src_memo === null) {
            state_set(fallback)

            return
        }

        return sc.signal_listen({
            target: src_memo,

            listener: () => {
                state_set(src_memo.output())
            },

            config: {
                emit: true,
            },
        })
    }, [src_memo, fallback])

    return state
}
