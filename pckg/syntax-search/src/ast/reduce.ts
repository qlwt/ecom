import * as sx from "@qyu/syntax-core"
import type { Schema } from "@src/schema/new"
import { TreeNode_Type, type TreeNode } from "@src/type/treenode"

export const ast_reduce = function(ast: sx.Tree_Slot<TreeNode>) {
    type ComputedValue = Schema

    return sx.tree_reduce<TreeNode, ComputedValue>({
        root: ast,

        reducer: api => {
            switch (api.node.type) {
                case TreeNode_Type.FilterSpecific: {
                    if (api.node.value === null) {
                        // interpret as ambigious
                        return {
                            value: {
                                op: "~",
                                value: api.node.label,
                            }
                        }
                    }

                    switch (api.node.op) {
                        case "<":
                        case "<=":
                        case ">":
                        case ">=": {
                            const value_int = Number.parseInt(api.node.value)

                            if (!Number.isNaN(value_int)) {
                                return {
                                    value: {
                                        op: api.node.op,
                                        value: value_int,
                                        label: api.node.label,
                                    },
                                }
                            } else {
                                // interpret as ambigious
                                return {
                                    value: {
                                        op: "~",
                                        value: api.node.label,
                                    },
                                }
                            }
                        }
                        case "=":
                            return {
                                value: {
                                    op: api.node.op,
                                    label: api.node.label,
                                    value: api.node.value,
                                },
                            }
                    }
                }
                case TreeNode_Type.FilterAmbigious: {
                    return {
                        value: {
                            op: "~",
                            value: api.node.text,
                        },
                    }
                }
                case TreeNode_Type.Priority: {
                    if (!api.node.child.node) {
                        throw new Error(`Unifinished Priority Expression`)
                    }

                    const child_computed = api.compute.get(api.node.child.node)

                    if (child_computed === undefined) {
                        api.queue.push(api.node.child.node)

                        return null
                    } else {
                        return { value: child_computed }
                    }
                }
                case TreeNode_Type.OpBinary: {
                    if (!api.node.left.node || !api.node.right.node) {
                        throw new Error(`Unifinished Binary Operation ${api.node.operation}`)
                    }

                    const l = api.compute.get(api.node.left.node)
                    const r = api.compute.get(api.node.right.node)

                    if (l === undefined) {
                        api.queue.push(api.node.left.node)

                        if (r === undefined) {
                            api.queue.push(api.node.right.node)
                        }

                        return null
                    } else if (r === undefined) {
                        api.queue.push(api.node.right.node)

                        return null
                    } else {
                        const result: Schema = { op: api.node.operation, children: [] }

                        if (l.op === api.node.operation) {
                            result.children.push(...l.children)
                        } else {
                            result.children.push(l)
                        }

                        if (r.op === api.node.operation) {
                            result.children.push(...r.children)
                        } else {
                            result.children.push(r)
                        }

                        return {
                            value: result
                        }
                    }
                }
            }
        },
    })
}
