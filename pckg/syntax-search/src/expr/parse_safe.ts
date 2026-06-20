import { expr_parse } from "@src/expr/parse"
import type { Schema } from "@src/schema/new"

export const expr_parse_safe = function(src: string): Schema | undefined {
    try {
        return expr_parse(src)
    } catch (e) {
        return undefined
    }
}
