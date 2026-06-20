export type Object_NewMap_Mapper<Obj extends {}, T> = {
    (value: Obj[keyof Obj], key: keyof Obj, source: Obj): T
}

export type Object_NewMap_Return<Obj extends {}, T> = {
    [K in keyof Obj]: T
}

export const object_new_map = function <Obj extends {}, T>(obj: Obj, mapper: Object_NewMap_Mapper<Obj, T>): Object_NewMap_Return<Obj, T> {
    const result: Partial<Object_NewMap_Return<Obj, T>> = {}

    for (const obj_key of Object.keys(obj) as (keyof Obj)[]) {
        const obj_value = obj[obj_key]!

        result[obj_key] = mapper(obj_value, obj_key, obj)
    }

    return result as Object_NewMap_Return<Obj, T>
}
