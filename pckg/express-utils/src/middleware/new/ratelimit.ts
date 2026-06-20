import type { Middleware } from "@src/middleware/type/middleware"
import * as ratelimit from "express-rate-limit"
import type * as express from "express"

export type Middleware_NewRateLimit_Params = {
    readonly limit: number
    readonly window: number
    readonly subnet: number
    readonly skip_new?: (req: express.Request, res: express.Response) => Promise<boolean>
}

export const middleware_new_ratelimit = function (params: Middleware_NewRateLimit_Params): Middleware {
    return ratelimit.rateLimit({
        limit: params.limit,
        skip: params.skip_new,
        windowMs: params.window,
        ipv6Subnet: params.subnet,
        standardHeaders: "draft-8",
    })
}
