import type { Middleware } from "@src/middleware/type/middleware"
import compression from "compression"

export const middleware_new_gzip_strong = function(): Middleware {
    return compression({
        level: 9
    })
}

export const middleware_new_gzip_normal = function(): Middleware {
    return compression({
        level: 6,
    })
}

export const middleware_new_gzip_loose = function(): Middleware {
    return compression({
        level: 4,
    })
}
