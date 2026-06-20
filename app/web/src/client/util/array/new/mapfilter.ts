type Mapper<T, R> = {
    (value: T, index: number, src: readonly T[]): R | undefined | null
}

export const array_new_mapfilter = function <T, R>(src: readonly T[], mapper: Mapper<T, R>): R[] {
    const result: R[] = new Array(src.length)

    let j = 0

    for (let i = 0 ; i < src.length; ++i) {
        const src_v = src[i]!
        const mapper_v = mapper(src_v, i, src)

        if (mapper_v !== undefined && mapper_v !== null) {
            result[j] = mapper_v

            ++j;
        }
    }

    result.length = j

    return result
}
