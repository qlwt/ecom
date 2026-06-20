export const object_pick = function <Src>(src: Src): (Src extends object ? Src : never) | null {
    if (typeof src === "object") {
        return src as any
    }

    return null
}
