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

            sx.route_new_pattern({
                name: "name",
                next_new: () => resolve({ key: "operator_binary" }, {
                    ...meta,

                    state_aftername: true,
                }),

                token: {
                    type: TokenType.Name,
                },

                pattern: sx.pattern_new_regex({
                    regex: /[a-zA-Z_]+/g,
                })
            }),

            sx.route_new_pattern({
                name: "number",
                next_new: () => resolve({ key: "operator_binary" }, meta),

                token: {
                    type: TokenType.Number
                },

                pattern: sx.pattern_new_regex({
                    regex: /-?[0-9][0-9]*/g
                })
            }),

            sx.route_new_pattern({
                name: "priority-scope",

                next_new: () => resolve({ key: "symbol" }, {
                    ...meta,

                    scope: [...meta.scope, TokenScope.Priority],
                }),

                token: {
                    type: TokenType.PriorityOpen
                },

                pattern: sx.pattern_new_regex({
                    regex: /\(/g
                })
            }),

            ...(meta.scope.at(-1) === TokenScope.Function ? [sx.route_new_pattern({
                name: "fn-close",

                next_new: () => resolve({ key: "operator_binary" }, {
                    ...meta,

                    scope: meta.scope.slice(0, -1),
                }),

                pattern: sx.pattern_new_regex({
                    regex: /\)/g,
                }),

                token: {
                    type: TokenType.FnClose,
                },
            })] : [])
        ],
    })
}
