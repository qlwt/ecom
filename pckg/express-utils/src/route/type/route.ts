import type { Response, Response_Body_Generic } from "@src/response/type/response"
import * as express from "express"

export type RESTMethod = Extract<keyof express.Router, (
    | "get"
    | "patch"
    | "post"
    | "put"
    | "head"
    | "delete"
    | "trace"
    | "options"
    | "connect"
)>

export type Route<Body extends Response_Body_Generic = Response_Body_Generic> = {
    readonly path: string
    readonly method: RESTMethod
    readonly handler: (req: express.Request, res: express.Response) => Response<Body> | Promise<Response<Body>>
}

export type Route_InferBody<Src extends Route> = (Src extends Route<infer Body>
    ? Body
    : never
)
