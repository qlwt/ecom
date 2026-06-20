export const object_strip = function <Src extends {}>(src: Src): Src {
    const cpy = {} as Partial<Src>

    for (const key of Object.keys(src)) {
        const value = src[key as keyof Src]

        if (value !== undefined) {
            cpy[key as keyof Src] = value
        }
    }

    return cpy as Src
}
