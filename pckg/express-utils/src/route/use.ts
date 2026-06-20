import * as cst from "@fst/cst"
import { ErrorExpress } from "@src/error/core/ErrorExpress";
import type { Route } from "@src/route/type/route";
import * as express from "express";

const tryawait = function <T> (value: T | Promise<T>): Promise<T> {
    if (value instanceof Promise) {
        return value
    }

    return Promise.resolve(value)
}

export const route_use = function(src: Route, router: express.Router): void {
    router[src.method](src.path, async (req, res) => {
        try {
            const result = src.handler(req, res)
            const response = await tryawait(result)

            for (const [key, value] of Object.entries(response.headers)) {
                res.setHeader(key, value)
            }

            res.status(response.status)

            if (response.body instanceof Buffer) {
                res.end(response.body)
            } else {
                res.end(JSON.stringify(response.body))
            }
        } catch (error) {
            if (error instanceof ErrorExpress) {
                console.error(error)

                res.status(error.express_status)
                res.end(error.express_message)
            } else {
                console.error(error)

                res.status(500)
                res.end(cst.ServerError.Internal)
            }
        }
    })
}
