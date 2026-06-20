import * as sx from "@qyu/syntax-core"
import { expr_prepare } from "@src/expr/prepare"
import type { TreeNode } from "@src/type/treenode"

export const expr_prepare_safe = function(src: string): sx.Tree_Slot<TreeNode> | undefined {
    try {
        return expr_prepare(src)
    } catch (e) {
        return undefined
    }
}
