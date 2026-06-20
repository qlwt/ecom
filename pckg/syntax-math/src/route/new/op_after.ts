import * as sx from "@qyu/syntax-core"
import { route_new_scope_end } from "@src/route/new/scope_end"
import type { BuilderData } from "@src/type/builder"
import type { Meta } from "@src/type/meta"
import { TokenScope } from "@src/type/scope"
import { TokenType } from "@src/type/token"

export const route_new_op_after = function(resolve: sx.Route__Build_Resolver<BuilderData, TokenType>, meta: Meta): sx.Route<TokenType> {
    return sx.route_new_orderracef({
        name: "operator-after",

        src: [
            sx.route_new_pattern({
                name: "whitespace",
                token: null,
                next_new: () => resolve({ key: "operator_binary" }, meta),

                pattern: sx.pattern_new_regex({
                    regex: /\s+/g
                }),
            }),

            sx.route_new_pattern({
                name: "operator-binary",

                next_new: () => resolve({ key: "symbol" }, {
                    ...meta,

                    state_aftername: false,
                }),

                token: {
                    type: TokenType.OpBinary
                },

                pattern: sx.pattern_new_regex({
                    regex: new RegExp("(" + [
                        "-",
                        "%",
                        "\\/",
                        "\\+",
                        "\\*",
                        "\\^",
                        "==",
                        ">(?!=)",
                        ">=",
                        "<(?!=)",
                        "<=",
                    ].join("|") + ")", "g")
                }),
            }),

            route_new_scope_end(resolve, meta),

            ...(meta.state_aftername ? [sx.route_new_pattern({
                name: "fn-open",

                next_new: () => resolve({ key: "symbol" }, {
                    ...meta,

                    state_aftername: false,
                    scope: [...meta.scope, TokenScope.Function],
                }),

                token: {
                    type: TokenType.FnOpen,
                },

                pattern: sx.pattern_new_regex({
                    regex: /\(/g
                }),
            })] : []),

            ...(meta.scope.at(-1) === TokenScope.Function ? [sx.route_new_pattern({
                name: "fn-comma",

                next_new: () => resolve({ key: "symbol" }, {
                    ...meta,

                    state_aftername: false,
                }),

                token: {
                    type: TokenType.FnComma,
                },

                pattern: sx.pattern_new_regex({
                    regex: /\,/g,
                }),
            })] : [])
        ],
    })
}
