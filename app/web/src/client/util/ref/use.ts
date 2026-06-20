import * as r from "react"

export const ref_use = function <T>(ref: r.Ref<T>, value: T): void {
    if (ref) {
        if (typeof ref === "object") {
            ref.current = value
        } else {
            ref(value)
        }
    }
}
