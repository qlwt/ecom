import * as sx from "@qyu/syntax-core"

export enum TreeNode_Type {
    FilterAmbigious,
    FilterSpecific,
    OpBinary,
    Priority,
}

export type TreeNodeOpBinary = {
    type: TreeNode_Type.OpBinary
    operation: "&" | "|"
    left: sx.Tree_Slot<TreeNode>
    right: sx.Tree_Slot<TreeNode>
}

export type TreeNodeFilterSpecific = {
    type: TreeNode_Type.FilterSpecific
    label: string
    op: ">" | ">=" | "<" | "<=" | "="
    value: string | null
}

export type TreeNodeFilterAmbiguous = {
    type: TreeNode_Type.FilterAmbigious
    text: string
}

export type TreeNodePriority = {
    type: TreeNode_Type.Priority
    child: sx.Tree_Slot<TreeNode>
}

export type TreeNode = (
    | TreeNodeOpBinary
    | TreeNodePriority
    | TreeNodeFilterSpecific
    | TreeNodeFilterAmbiguous
)
