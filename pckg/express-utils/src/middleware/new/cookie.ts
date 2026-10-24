import type { Middleware } from "@src/middleware/type/middleware"
import cookieparser from "cookie-parser"
import * as env_back from "@fst/cst/env_back"

export const middleware_new_cookie = function(): Middleware {
    return cookieparser(env_back.cookie_secret)
}
