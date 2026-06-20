import * as asc from "@qyu/atom-state-core"
import * as r from "react"

export const useAtomWrap = function <T>(value: T): asc.AtomSelectorStatic<T> {
    return r.useCallback(() => value, [value])
}
