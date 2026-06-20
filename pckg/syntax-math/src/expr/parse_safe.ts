import { expr_parse } from "@src/expr/parse"
import type { ReduceConfig } from "@src/type/reduce"

export const expr_parse_safe = function(src: string, config: ReduceConfig): number | null | undefined {
    try {
        return expr_parse(src, config)
    } catch (e) {
        return undefined
    }
}
