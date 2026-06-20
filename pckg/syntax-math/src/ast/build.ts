import { EOrder } from "@src/type/eorder"
import * as sx from "@qyu/syntax-core"
import { TreeNode_Type, type TreeNode } from "@src/type/treenode"
import { TokenType } from "@src/type/token"

const eorder_new_biop = function(operation: string): number {
    switch (operation) {
        case "+":
        case "-":
            return EOrder.OpBinaryAddition
        case "/":
            return EOrder.OpBinaryDiv
        case "*":
        case "%":
            return EOrder.OpBinaryMult
        case "^":
            return EOrder.OpBinaryPower
        case ">":
        case "<":
        case ">=":
        case "<=":
        case "==":
            return EOrder.OpBinaryComp
        default:
            return EOrder.OpBinaryAddition
    }
}

const eorder_new = function(node: TreeNode): number {
    switch (node.type) {
        case TreeNode_Type.OpBinary:
            return eorder_new_biop(node.operation)
        default:
            return EOrder.Expression
    }
}

export const ast_build = function(tokens: readonly sx.Token<TokenType>[]) {
    return sx.tree_build<TreeNode, TokenType>({
        tokens: tokens,

        handler: (pointer, token) => {
            switch (token.type) {
                case TokenType.Name: {
                    if (pointer.node !== null) {
                        throw new Error("TokenOrder: variable should be processed at nullish slot")
                    }

                    const name = sx.section_slice(token.section)

                    pointer.node = {
                        type: TreeNode_Type.Reference,
                        name,
                    }

                    return pointer
                }
                case TokenType.FnOpen: {
                    if (pointer.node?.type !== TreeNode_Type.Reference) {
                        throw new Error("TokenOrder: fnopen should be processed at reference slot")
                    }

                    pointer.node = {
                        type: TreeNode_Type.Function,
                        name: pointer.node.name,
                        args: [{
                            node: null,
                            parent: pointer
                        }],
                    }

                    return pointer.node.args[0]!
                }
                case TokenType.FnComma: {
                    let fnpointer = pointer

                    while (true) {
                        if (!fnpointer.parent) {
                            throw new Error(`TokenOrder: fncomma used outside of function`)
                        }

                        fnpointer = fnpointer.parent

                        if (fnpointer.node?.type === TreeNode_Type.Function) {
                            fnpointer.node.args.push({
                                node: null,
                                parent: fnpointer
                            })

                            return fnpointer.node.args.at(-1)!
                        }
                    }
                }
                case TokenType.FnClose: {
                    let fnpointer = pointer

                    while (true) {
                        if (!fnpointer.parent) {
                            throw new Error(`TokenOrder: fnclose used outside of function`)
                        }

                        fnpointer = fnpointer.parent

                        if (fnpointer.node?.type === TreeNode_Type.Function) {
                            {
                                const arg_last = fnpointer.node.args.at(-1)

                                if (arg_last && arg_last.node === null) {
                                    fnpointer.node.args.pop()
                                }
                            }

                            return fnpointer
                        }
                    }
                }
                case TokenType.Number: {
                    if (pointer.node !== null) {
                        throw new Error("TokenOrder: number should be processed at nullish slot")
                    }

                    const value = Number.parseInt(sx.section_slice(token.section))

                    if (Number.isNaN(value)) {
                        throw new Error(`TokenValue: number token is NaN value:${sx.section_slice(token.section)}`)
                    }

                    pointer.node = {
                        type: TreeNode_Type.Number,
                        value
                    }

                    return pointer
                }
                case TokenType.OpBinary: {
                    const operation = sx.section_slice(token.section)

                    return sx.tree_insert_eorder({
                        tree_pointer: pointer,
                        node_eorder: eorder_new,
                        insert_eorder: eorder_new_biop(operation),

                        insert_handler: slot => {
                            slot.node = {
                                type: TreeNode_Type.OpBinary,

                                operation,
                                left: { node: slot.node, parent: slot },
                                right: { node: null, parent: slot },
                            }

                            return slot.node.right
                        }
                    })
                }
                case TokenType.EOF: {
                    return null
                }
                case TokenType.PriorityOpen: {
                    pointer.node = {
                        type: TreeNode_Type.Priority,

                        child: {
                            parent: pointer,
                            node: pointer.node,
                        }
                    }

                    return pointer.node.child
                }
                case TokenType.PriorityClose: {
                    for (; ;) {
                        const parent = pointer.parent

                        if (parent && parent.node) {
                            const parent_node = parent.node

                            if (parent_node.type === TreeNode_Type.Priority) {
                                return parent
                            } else {
                                pointer = parent
                            }
                        } else {
                            throw new Error(`Unexpected closing of priority scope`)
                        }
                    }
                }
            }
        }
    })
}
