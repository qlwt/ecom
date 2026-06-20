import * as sx from "@qyu/syntax-core"
import { TreeNode_Type, type TreeNode } from "@src/type/treenode"
import { TokenType } from "@src/type/token"
import { EOrder } from "@src/type/eorder"

const eorder_new_biop = function(operation: "&" | "|"): number {
    switch (operation) {
        case "&":
            return EOrder.OpLogicAnd
        case "|":
            return EOrder.OpLogicOr
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

const opcomparison_parse = function(op: string) {
    switch (op) {
        case "=":
        case "eq":
            return "="
        case ">":
        case "gt":
            return ">"
        case ">=":
        case "gte":
            return ">="
        case "<":
        case "lt":
            return "<"
        case "<=":
        case "lte":
            return "<="
        default:
            throw new Error(`Unexpected OpComparison operation "${op}"`)
    }
}

const oplogic_parse = function(op: string) {
    switch (op) {
        case "&":
        case "and":
            return "&"
        case "|":
        case "or":
            return "|"
        default:
            throw new Error(`Unexpected OpLogic operation "${op}"`)
    }
}

export const ast_build = function(tokens: readonly sx.Token<TokenType>[]) {
    return sx.tree_build<TreeNode, TokenType>({
        tokens: tokens,

        handler: (pointer, token) => {
            switch (token.type) {
                case TokenType.Text: {
                    if (pointer.node === null) {
                        pointer.node = {
                            type: TreeNode_Type.FilterAmbigious,
                            text: sx.section_slice(token.section),
                        }

                        return pointer
                    }

                    switch (pointer.node.type) {
                        case TreeNode_Type.FilterAmbigious:
                            return sx.tree_insert_eorder({
                                tree_pointer: pointer,
                                node_eorder: eorder_new,
                                insert_eorder: eorder_new_biop("&"),

                                insert_handler: slot => {
                                    slot.node = {
                                        type: TreeNode_Type.OpBinary,

                                        operation: "&",

                                        left: {
                                            parent: slot,
                                            node: slot.node,
                                        },

                                        right: {
                                            parent: slot,

                                            node: {
                                                type: TreeNode_Type.FilterAmbigious,
                                                text: sx.section_slice(token.section),
                                            },
                                        },
                                    }

                                    return slot.node.right
                                }
                            })
                        case TreeNode_Type.FilterSpecific:
                            if (pointer.node.value === null) {
                                pointer.node.value = sx.section_slice(token.section)

                                return pointer
                            }

                            {
                                return sx.tree_insert_eorder({
                                    tree_pointer: pointer,
                                    node_eorder: eorder_new,
                                    insert_eorder: eorder_new_biop("&"),

                                    insert_handler: slot => {
                                        slot.node = {
                                            type: TreeNode_Type.OpBinary,

                                            operation: "&",

                                            left: {
                                                parent: slot,
                                                node: slot.node,
                                            },

                                            right: {
                                                parent: slot,

                                                node: {
                                                    type: TreeNode_Type.FilterAmbigious,
                                                    text: sx.section_slice(token.section),
                                                },
                                            },
                                        }

                                        return slot.node.right
                                    }
                                })
                            }
                        default:
                            throw new Error("TokenOrder: Text processed at unexpected pointer")
                    }
                }
                case TokenType.OpComparison: {
                    if (pointer.node?.type !== TreeNode_Type.FilterAmbigious) {
                        throw new Error("TokenOrder: opcomparison should be processed at FilterAmbigious slot")
                    }

                    const operation_raw = sx.section_slice(token.section)
                    const operation_parsed = opcomparison_parse(operation_raw)

                    pointer.node = {
                        type: TreeNode_Type.FilterSpecific,
                        label: pointer.node.text,
                        op: operation_parsed,
                        value: null
                    }

                    return pointer
                }
                case TokenType.OpLogic: {
                    const operation_raw = sx.section_slice(token.section)
                    const operation_parsed = oplogic_parse(operation_raw)

                    return sx.tree_insert_eorder({
                        tree_pointer: pointer,
                        node_eorder: eorder_new,
                        insert_eorder: eorder_new_biop(operation_parsed),

                        insert_handler: slot => {
                            slot.node = {
                                type: TreeNode_Type.OpBinary,

                                operation: operation_parsed,
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
