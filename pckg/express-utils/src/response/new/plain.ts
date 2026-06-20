import type { Response } from "@src/response/type/response"

export type Response__NewPlain_Params = {
    readonly body: string

    readonly status?: number
    readonly headers?: Readonly<Record<string, string>>
}

export const response_new_plain = function(params: Response__NewPlain_Params): Response<string> {
    return {
        body: params.body,
        status: params.status || 200,

        headers: {
            ...params.headers,

            "Content-Type": "text/plain"
        }
    }
}
