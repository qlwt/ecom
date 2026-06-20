import type { Response, Response_Body_Generic } from "@src/response/type/response"

export type Response__NewCustom_Params<Body extends Response_Body_Generic> = {
    readonly body: Body
    readonly status: number
    readonly headers: Readonly<Record<string, string>> & { "Content-Type": string }
}

type Params<Body extends Response_Body_Generic> = Response__NewCustom_Params<Body>

export const response_new_custom = function <Body extends Response_Body_Generic>(params: Params<Body>): Response<Body> {
    return {
        body: params.body,
        status: params.status,
        headers: params.headers
    }
}
