import type { Middleware } from "@src/middleware/type/middleware"
import * as express from "express"

export const middleware_new_url_short = function(): Middleware {
    return express.urlencoded({
        limit: (1 << 10) * 3,
        extended: true,
    })
}

export const middleware_new_url_long = function(): Middleware {
    return express.urlencoded({
        limit: (1 << 10) * 500,
        extended: true,
    })
}

export const middleware_new_url_custom = function(limit: number): Middleware {
    return express.urlencoded({
        limit,
        extended: true,
    })
}
