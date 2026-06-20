import * as sx from "@qyu/syntax-core"
import { route_build } from "@src/route/build"

export const expr_validate = function (src: string): boolean {
    try {
        const parsed = sx.lexer_parse({ src, route: route_build(), })

        if (parsed.error !== null) {
            return false
        }

        return true
    } catch (e) {
        return false
    }
}
