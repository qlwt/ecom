import * as cs from "@fst/config/server"

export type Sql_RelationCondition = {
    readonly self_field: string
    readonly operator: string
    readonly relation_field: string
    readonly relation_name: keyof cs.Database
}

export type Sql_Relation = {
    readonly name: keyof cs.Database
    readonly join_condition: Sql_RelationCondition[]
}

export type Sql_RelationFilter = {
    readonly [K in keyof cs.Database]?: boolean
}
