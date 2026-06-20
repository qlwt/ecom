import { middleware_new_merge } from "@src/middleware/new/merge";
import type { Middleware } from "@src/middleware/type/middleware";
import type { Response, Response_Body_Generic } from "@src/response/type/response";
import type { RESTMethod, Route } from "@src/route/type/route";
import * as express from "express";

export type Route__NewPath_Context = {
    readonly req: express.Request
    readonly res: express.Response
}

export type Route__NewPath_Handler<Body extends Response_Body_Generic> = {
    (context: Route__NewPath_Context): Promise<Response<Body>> | Response<Body>
}

export type Route__NewPath_Params<Body extends Response_Body_Generic> = {
    readonly path: string
    readonly method: RESTMethod
    readonly handler: Route__NewPath_Handler<Body>

    readonly middleware?: readonly Middleware[]
}

type Params<Body extends Response_Body_Generic> = Route__NewPath_Params<Body>

export const route_new_path = function <Body extends Response_Body_Generic>(params: Params<Body>): Route<Body> {
    return {
        path: params.path,
        method: params.method,

        handler: (req, res) => new Promise<Response<Body>>((resolve, reject) => {
            const next: express.NextFunction = async (error) => {
                if (error) {
                    reject(error)
                } else {
                    try {
                        const result = params.handler({ req, res })

                        if (result instanceof Promise) {
                            resolve(await result)
                        } else {
                            resolve(result)
                        }
                    } catch (e) {
                        reject(e)
                    }
                }
            }

            if (params.middleware) {
                middleware_new_merge(params.middleware)(req, res, next)
            } else {
                next()
            }
        })
    }
}
