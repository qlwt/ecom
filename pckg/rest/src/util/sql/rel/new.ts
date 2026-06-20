import * as cs from "@fst/config/server"
import type { Sql_Relation, Sql_RelationFilter } from "@src/util/sql/type/relation"

export type Sql_NewGet_Potential = [
    keyof cs.Database,
    () => Sql_Relation[]
][]

export const sqlrel_new = function(potential: Sql_NewGet_Potential, filter: Sql_RelationFilter): Sql_Relation[] {
    const result: Sql_Relation[] = []

    for (const src of potential) {
        const [key, factory] = src

        if (filter[key] !== false) {
            result.push(...factory())
        }
    }

    return result
}
