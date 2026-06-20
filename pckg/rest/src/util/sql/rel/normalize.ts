import type { Sql_Relation } from "@src/util/sql/type/relation"

type Mutable<T extends {}> = {
    -readonly [K in keyof T]: T[K]
}

export const sqlrel_normalize = function(relations: readonly Sql_Relation[]): Sql_Relation[] {
    const indexes = new Map<string, number>()
    const normalized: Mutable<Sql_Relation>[] = []

    for (let i = relations.length - 1; i >= 0; --i) {
        const i_rel = relations[i]!
        const l = indexes.get(i_rel.name)

        if (l === undefined) {
            indexes.set(i_rel.name, normalized.length)

            normalized.push({ ...i_rel })
        } else {
            const l_rel = normalized[l]!

            l_rel.join_condition = [...l_rel.join_condition, ...i_rel.join_condition]
        }
    }

    return normalized.reverse()
}
