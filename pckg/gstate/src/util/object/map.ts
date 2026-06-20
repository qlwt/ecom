export const object_new_map = function <Obj extends {}, Ret>(
    source: Obj,
    mapper: (value: Obj[keyof Obj], key: keyof Obj, source: Obj) => Ret
): { [K in keyof Obj]: Ret } {
    const result: { [K in keyof Obj]?: Ret } = {}

    for (const key of Object.keys(source) as (keyof Obj)[]) {
        result[key] = mapper(source[key], key, source)
    }

    return result as { [K in keyof Obj]: Ret }
}
