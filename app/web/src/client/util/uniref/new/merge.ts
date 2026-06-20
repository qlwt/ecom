import type { UniRef } from "@src/client/util/uniref/type/uniref";
import { uniref_use } from "@src/client/util/uniref/use";

type Nullish<T> = T | null | undefined

export const uniref_new_merge = function <T>(a: Nullish<UniRef<T>>, b: Nullish<UniRef<T>>): UniRef<T> {
    return (value) => {
        uniref_use(a, value)
        uniref_use(b, value)
    }
}
