import * as sx from "@qyu/syntax-core"
import { ast_build } from "@src/ast/build"
import { route_build } from "@src/route/build"
import type { TreeNode } from "@src/type/treenode"

export const expr_prepare = function(src: string): sx.Tree_Slot<TreeNode> {
    const parsed = sx.lexer_parse({ src, route: route_build(), })

    if (parsed.error !== null) {
        const preview_start = Math.max(0, parsed.error.section.pointer - 10)
        const preview_end = parsed.error.section.pointer + parsed.error.section.length + 10

        throw new Error(
            `Error while tokenising.`
            + `  At position ${parsed.error.section.pointer}`
            + `  Expected ${parsed.error.expectation}`
            + `  Got: ${src.slice(preview_start, preview_end)}`
        )
    }

    return ast_build(parsed.tokens)
}
