import * as sx from "@qyu/syntax-core"
import type { BuilderData } from "@src/type/builder"
import type { Meta } from "@src/type/meta"
import { TokenScope } from "@src/type/scope"
import { TokenType } from "@src/type/token"

export const route_new_symbol = function(resolve: sx.Route__Build_Resolver<BuilderData, TokenType>, meta: Meta): sx.Route<TokenType> {
    return sx.route_new_orderracef({
        name: "symbol",

        src: [
            sx.route_new_pattern({
                name: "whitespace",
                token: null,
                next_new: () => resolve({ key: "symbol" }, meta),

                pattern: sx.pattern_new_regex({
                    regex: /\s+/g
                }),
            }),

            ...((meta.state_charge === 1 || meta.state_charge === 2) ? [sx.route_new_pattern({
                name: "op-logic",

                next_new: () => resolve({ key: "symbol" }, {
                    ...meta,

                    state_charge: 0,
                }),

                token: {
                    type: TokenType.OpLogic,
                },

                pattern: sx.pattern_new_regex({
                    regex: /(and|or|\||\&)/g
                })
            })] : []),

            ...(meta.state_charge === 2 ? [sx.route_new_pattern({
                name: "op-comp",

                next_new: () => resolve({ key: "symbol" }, {
                    ...meta,

                    state_charge: 3,
                }),

                token: {
                    type: TokenType.OpComparison,
                },

                pattern: sx.pattern_new_regex({
                    regex: new RegExp(`(
                        =
                        | >=
                        | >
                        | <
                        | <=
                        | eq
                        | lte
                        | lt
                        | gte
                        | gt
                    )`.replaceAll(/\s+/g, ""), "g")
                })
            })] : [sx.route_new_pattern({
                name: "text",

                next_new: () => resolve({ key: "symbol" }, {
                    ...meta,

                    state_charge: meta.state_charge <= 1 ? 2 : 0,
                }),

                token: {
                    type: TokenType.Text,
                },

                pattern: sx.pattern_new_regex({
                    regex: /[=<>]+/g
                })
            })]),

            sx.route_new_pattern({
                name: "text",

                next_new: () => resolve({ key: "symbol" }, {
                    ...meta,

                    state_charge: meta.state_charge <= 2 ? 2 : 0,
                }),

                token: {
                    type: TokenType.Text,
                },

                pattern: sx.pattern_new_regex({
                    regex: /[^\s\(\)=<>]+/g
                })
            }),

            ...(meta.state_charge !== 3 ? [sx.route_new_pattern({
                name: "priority-open",

                next_new: () => resolve({ key: "symbol" }, {
                    ...meta,

                    state_charge: 0,
                    scope: [...meta.scope, TokenScope.Priority],
                }),

                token: {
                    type: TokenType.PriorityOpen
                },

                pattern: sx.pattern_new_regex({
                    regex: /\(/g
                })
            })] : [sx.route_new_pattern({
                name: "text",

                next_new: () => resolve({ key: "symbol" }, {
                    ...meta,

                    state_charge: meta.state_charge <= 1 ? 2 : 0,
                }),

                token: {
                    type: TokenType.Text,
                },

                pattern: sx.pattern_new_regex({
                    regex: /[\(]+/g
                })
            })]),

            ...(meta.scope.at(-1) === TokenScope.Priority ? [sx.route_new_pattern({
                name: "priority-close",

                next_new: () => resolve({ key: "symbol" }, {
                    ...meta,

                    state_charge: 1,
                    scope: meta.scope.slice(0, -1),
                }),

                token: {
                    type: TokenType.PriorityClose
                },

                pattern: sx.pattern_new_regex({
                    regex: /\)/g
                })
            })] : []),

            ...(meta.scope.at(-1) === TokenScope.Root ? [sx.route_new_eof({
                name: "eof",

                token: {
                    type: TokenType.EOF
                },
            })] : []),
        ],
    })
}
