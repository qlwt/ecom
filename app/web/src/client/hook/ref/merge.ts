import { ref_use } from "@src/client/util/ref/use"
import * as r from "react"

export const useRefMerge = function <T>(...refs: r.Ref<T>[]): (v: T) => void {
    return r.useCallback((value: T) => {
        for (const ref of refs) {
            ref_use(ref, value)
        }
    }, refs)
}
