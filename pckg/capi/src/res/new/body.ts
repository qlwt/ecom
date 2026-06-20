import type { ApiResponse } from "@src/res/type/ApiResponse";

export type Res_NewBody_Params<T> = Readonly<{
    source: Promise<Response>
    parse: (api: Readonly<{ body: string, response: Response }>) => ApiResponse<T>
}>

export const res_new_body = function <T>(params: Res_NewBody_Params<T>): Promise<ApiResponse<T>> {
    return params.source.then(
        async response => {
            const body = await response.text()

            return params.parse({ body, response })
        },
        reason => {
            return {
                success: false,
                reason
            }
        }
    )
}
