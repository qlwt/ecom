const deepclone = function <T>(src: T): T {
    if (Array.isArray(src)) {
        return src.map(n => deepclone(n)) as T
    }

    if (src instanceof Set) {
        return new Set(
            [...src.values()].map(n => {
                return deepclone(n)
            })
        ) as T
    }

    if (src instanceof Map) {
        return new Map(
            [...src.entries()].map(n => {
                return [deepclone(n[0]), deepclone(n[1])]
            })
        ) as T
    }

    if (src instanceof Date) {
        return new Date(src) as T
    }

    if (typeof src === "object" && src !== null) {
        let r: T = {} as T

        for (const key of Object.keys(src)) {
            r[key as keyof typeof src] = deepclone(src[key as keyof typeof src])
        }

        return r as any
    }

    return src
}

if (window.structuredClone === undefined) {
    window.structuredClone = function(a) {
        return deepclone(a)
    }
}
