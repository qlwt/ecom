import * as sx from "@qyu/syntax-core"
import { route_new_op_after } from "@src/route/new/op_after"
import { route_new_symbol } from "@src/route/new/symbol"
import type { BuilderData } from "@src/type/builder"
import { TokenScope } from "@src/type/scope"
import type { TokenType } from "@src/type/token"

export const route_build = function() {
    return sx.route_build<BuilderData, TokenType>({
        routes: {
            symbol: (api, ...params) => route_new_symbol(api.resolve, ...params),
            operator_binary: (api, ...params) => route_new_op_after(api.resolve, ...params),
        }
    })({ key: "symbol" }, {
        state_aftername: false,
        scope: [TokenScope.Root],
    })
}
