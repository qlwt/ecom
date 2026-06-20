import { env_cookie_secret } from "@src/env"
import type { Middleware } from "@src/middleware/type/middleware"
import cookieparser from "cookie-parser"

export const middleware_new_cookie = function(): Middleware {
    return cookieparser(env_cookie_secret)
}
