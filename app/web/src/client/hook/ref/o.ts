import * as r from "react"

export const useRefO = function <T>(ref: r.RefObject<T>): () => T {
    return r.useCallback(() => ref.current, [ref])
}
