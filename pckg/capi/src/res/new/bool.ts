import type { ApiResponse } from "@src/res/type/ApiResponse";

export type Res_NewBool_Params = Readonly<{
    source: Promise<Response>
    success?: (api: Readonly<{ body: string, response: Response }>) => boolean
}>

export const res_new_bool = function(params: Res_NewBool_Params): Promise<ApiResponse<null>> {
    return params.source.then(
        async response => {
            if (params.success) {
                const body = await response.text()

                if (params.success({ body, response })) {
                    return {
                        success: true,
                        body: null
                    }
                }

                return {
                    success: false,
                    reason: body
                }
            }

            if (response.status >= 200 && response.status < 300) {
                return {
                    success: true,
                    body: null
                }
            }

            return {
                success: false,
                reason: await response.text()
            }
        },
        reason => {
            return {
                success: false,
                reason
            }
        }
    )
}
