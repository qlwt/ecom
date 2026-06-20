type Src_G = Readonly<Record<string, any>>

export type Object_NewPrefix_Output<Src extends Readonly<Record<string, any>>, Prefix extends string> = {
    [K in keyof Src as `${Prefix}${Extract<K, string>}`]: Src[K]
}

export const object_new_prefix = function <Src extends Src_G, Prefix extends string>(
    src: Src, prefix: Prefix
): Object_NewPrefix_Output<Src, Prefix> {
    const result: Partial<Object_NewPrefix_Output<Src, Prefix>> = {}

    for (const key of Object.keys(src) as (Extract<keyof Src, string>)[]) {
        result[`${prefix}${key}`] = src[key]
    }

    return result as any as Object_NewPrefix_Output<Src, Prefix>
}
