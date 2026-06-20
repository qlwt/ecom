import * as sx from "@qyu/syntax-core"

export enum TreeNode_Type {
    Number,
    OpBinary,
    Priority,
    Function,
    Reference,
}

export type TreeNodeOpBinary = {
    type: TreeNode_Type.OpBinary
    operation: string
    left: sx.Tree_Slot<TreeNode>
    right: sx.Tree_Slot<TreeNode>
}

export type TreeNodeNumber = {
    type: TreeNode_Type.Number
    value: number
}

export type TreeNodeFunction = {
    type: TreeNode_Type.Function
    name: string
    args: sx.Tree_Slot<TreeNode>[]
}

export type TreeNodeReference = {
    type: TreeNode_Type.Reference
    name: string
}

export type TreeNodePriority = {
    type: TreeNode_Type.Priority
    child: sx.Tree_Slot<TreeNode>
}

export type TreeNode = (
    | TreeNodeOpBinary
    | TreeNodeNumber
    | TreeNodePriority
    | TreeNodeFunction
    | TreeNodeReference
)
