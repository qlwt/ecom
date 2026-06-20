export type Object__Transform_Schema<Src extends {}> = {
    [K in keyof Src]?: (value: Src[K], key: K, src: Src) => any
}

export type Object__Transform_Output<Src extends {}, Schema extends Object__Transform_Schema<Src>> = {
    [K in keyof Src]: Schema[K] extends (...params: any[]) => infer R ? R : Src[K]
}

export const object_transform = function <Src extends {}, Schema extends Object__Transform_Schema<Src>>(
    src: Src, schema: Schema
): Object__Transform_Output<Src, Schema> {
    const cpy = {} as Partial<Src>

    for (const key of Object.keys(src)) {
        const transformer = schema[key as keyof Src] as (value: Src[keyof Src], key: keyof Src, src: Src) => any

        if (transformer) {
            const value = transformer(src[key as keyof Src], key as keyof Src, src)

            if (value !== undefined) {
                cpy[key as keyof Src] = value
            }
        } else {
            const value = src[key as keyof Src]

            if (value !== undefined) {
                cpy[key as keyof Src] = value
            }
        }
    }

    return cpy as Object__Transform_Output<Src, Schema>
}
