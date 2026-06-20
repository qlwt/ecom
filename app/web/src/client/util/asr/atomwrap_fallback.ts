import * as asc from "@qyu/atom-state-core"
import * as r from "react"

export const useAtomWrapFallback = function <T>(value: T | null): asc.AtomSelectorStatic<T> | null {
    return r.useMemo(() => {
        if (value === null) {
            return null
        }

        return () => value
    }, [value])
}
