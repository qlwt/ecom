import * as sx from "@qyu/syntax-core"
import type { ReduceConfig } from "@src/type/reduce"
import { TreeNode_Type, type TreeNode } from "@src/type/treenode"

export const ast_reduce = function(ast: sx.Tree_Slot<TreeNode>, config: ReduceConfig) {
    type ComputedValue = number | null

    return sx.tree_reduce<TreeNode, ComputedValue>({
        root: ast,

        reducer: api => {
            switch (api.node.type) {
                case TreeNode_Type.Number: {
                    return {
                        value: api.node.value,
                    }
                }
                case TreeNode_Type.Reference: {
                    if (!(api.node.name in config.vars)) {
                        throw new Error(`Unregistered reference ${api.node.name}`)
                    }

                    return {
                        value: config.vars[api.node.name] as ComputedValue,
                    }
                }
                case TreeNode_Type.Function: {
                    const args_computed: ComputedValue[] = []

                    if (!(api.node.name in config.fns)) {
                        throw new Error(`Unregistered function ${api.node.name}`)
                    }

                    for (const arg of api.node.args) {
                        if (!arg.node) {
                            throw new Error(`Unfinished function`)
                        }

                        if (api.compute.has(arg.node)) {
                            args_computed.push(api.compute.get(arg.node) as ComputedValue)
                        } else {
                            api.queue.push(arg.node)
                        }
                    }

                    if (args_computed.length === api.node.args.length) {
                        return {
                            value: config.fns[api.node.name]!.apply(null, args_computed),
                        }
                    }

                    return null
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

                    if (l === null) {
                        throw new Error(`Left operand is null ${api.node.operation}`)
                    }

                    if (r === null) {
                        throw new Error(`Right operand is null ${api.node.operation}`)
                    }

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
                        switch (api.node.operation) {
                            case "+":
                                return { value: l + r }
                            case "-":
                                return { value: l - r }
                            case "/":
                                return { value: l / r }
                            case "%":
                                return { value: l % r }
                            case "*":
                                return { value: l * r }
                            case "^":
                                return { value: l ** r }
                            case "==":
                                return { value: Number(l === r) }
                            case ">=":
                                return { value: Number(l >= r) }
                            case ">":
                                return { value: Number(l > r) }
                            case "<=":
                                return { value: Number(l <= r) }
                            case "<":
                                return { value: Number(l < r) }
                            default: {
                                throw new Error(`Unexpected operation ${api.node.operation}`)
                            }
                        }
                    }
                }
            }
        },
    })
}
