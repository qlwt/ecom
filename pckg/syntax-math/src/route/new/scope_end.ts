import * as sx from "@qyu/syntax-core"
import type { BuilderData } from "@src/type/builder"
import type { Meta } from "@src/type/meta"
import { TokenScope } from "@src/type/scope"
import { TokenType } from "@src/type/token"

export const route_new_scope_end = function(resolve: sx.Route__Build_Resolver<BuilderData, TokenType>, meta: Meta): sx.Route<TokenType> {
    const scope = meta.scope[meta.scope.length - 1]

    switch (scope) {
        case TokenScope.Priority:
            return sx.route_new_pattern({
                name: "priority-scope-end",

                next_new: () => resolve({ key: "operator_binary" }, {
                    ...meta,

                    state_aftername: false,
                    scope: meta.scope.slice(0, -1)
                }),

                token: {
                    type: TokenType.PriorityClose
                },

                pattern: sx.pattern_new_regex({
                    regex: /\)/g
                }),
            })
        case TokenScope.Function:
            return sx.route_new_pattern({
                name: "fn-close",

                next_new: () => resolve({ key: "operator_binary" }, {
                    ...meta,

                    state_aftername: false,
                    scope: meta.scope.slice(0, -1)
                }),

                token: {
                    type: TokenType.FnClose
                },

                pattern: sx.pattern_new_regex({
                    regex: /\)/g
                }),
            })
        case TokenScope.Root:
        default: {
            return sx.route_new_eof({
                name: "end-of-file",
                token: null,
            })
        }
    }
}
