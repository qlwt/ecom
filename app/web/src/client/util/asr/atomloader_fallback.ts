import * as r from "react"
import * as asc from "@qyu/atom-state-core"
import * as asr from "@qyu/atom-state-react"

export const useAtomLoaderFallback = function(loader: asc.AtomLoader<[]> | null) {
    const store = asr.useAtomStore()

    r.useEffect((): VoidFunction | void => {
        if (loader) {
            return store.reg(loader).request()
        }
    }, [loader, store])
}
