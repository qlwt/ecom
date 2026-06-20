import type { UniRef } from "@src/client/util/uniref/type/uniref";

export const uniref_use = function <T>(ref: UniRef<T> | null | undefined, value: T): void {
    if (ref) {
        if (typeof ref === "object") {
            ref.current = value
        } else {
            ref(value)
        }
    }
}
