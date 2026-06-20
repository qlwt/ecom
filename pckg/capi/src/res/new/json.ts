import { res_new_body } from "@src/res/new/body";
import type { ApiResponse } from "@src/res/type/ApiResponse";

export type Res_NewJSON_Params = Readonly<{
    source: Promise<Response>
}>

export const res_new_json = function <T = any>(params: Res_NewJSON_Params): Promise<ApiResponse<T>> {
    return res_new_body({
        source: params.source,

        parse: ({ body, response }) => {
            if (response.status < 200 || response.status >= 300) {
                return {
                    success: false,
                    reason: body,
                }
            }

            try {
                const json = JSON.parse(body)

                return {
                    success: true,
                    body: json as T
                }
            } catch (e) {
                return {
                    success: false,
                    reason: e
                }
            }
        },
    })
}
