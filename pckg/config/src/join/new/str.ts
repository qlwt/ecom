import type { Join } from "@src/join/type/join";

export type Join_NewStr_Def = (
    `${string}${"?->" | "->" | "<-"}$${string}->${string}::${string}`
)

const relation_regexp = /(<-)|(\?->)|(->)/

export const join_new_str = function(def: Join_NewStr_Def): Join {
    const relation_match = def.match(relation_regexp)

    if (relation_match) {
        const relation_arrow = relation_match[0]
        const relation_point = relation_match.index!
        const self_field = def.slice(0, relation_point)
        const [target_table, target_field, variant] = def.slice(relation_point + relation_arrow.length + 1).split(/->|::/g) as [string, string, string]

        return {
            kind: relation_arrow.endsWith("->") ? "forwards" : "backwards",
            status_optional: relation_arrow.startsWith("?"),
            variant,
            self_field,
            target_table,
            target_field,
        }
    } else {
        throw new Error("no relation match")
    }
}
