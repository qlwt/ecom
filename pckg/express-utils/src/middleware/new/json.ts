import type { Middleware } from "@src/middleware/type/middleware"
import * as express from "express"

export const middleware_new_json_short = function(): Middleware {
    return express.json({
        limit: (1 << 10) * 10
    })
}

export const middleware_new_json_long = function(): Middleware {
    return express.json({
        limit: (1 << 20) * 1
    })
}

export const middleware_new_json_custom = function(limit: number): Middleware {
    return express.json({
        limit,
    })
}
