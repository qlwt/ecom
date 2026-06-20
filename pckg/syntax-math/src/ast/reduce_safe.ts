import * as sx from "@qyu/syntax-core"
import { ast_reduce } from "@src/ast/reduce"
import type { ReduceConfig } from "@src/type/reduce"
import { type TreeNode } from "@src/type/treenode"

export const ast_reduce_safe = function(ast: sx.Tree_Slot<TreeNode>, config: ReduceConfig) {
    try {
        return ast_reduce(ast, config)
    } catch (e) {
        return null
    }
}
