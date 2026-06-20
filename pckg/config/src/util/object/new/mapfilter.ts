export type Object_NewMap_Mapper<Src extends {}, R> = {
    (v: Src[keyof Src], k: keyof Src, src: Src): R | undefined
}

export const object_new_mapfilter = function <Src extends {}, R>(src: Src, mapper: Object_NewMap_Mapper<Src, R>): { [K in keyof Src]: R } {
    const result: { [K in keyof Src]?: R } = {}

    for (const key of Object.keys(src) as (keyof Src)[]) {
        const mapped = mapper(src[key], key, src)

        if (mapped !== undefined) {
            result[key] = mapped
        }
    }

    return result as { [K in keyof Src]: R }
}
