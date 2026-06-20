import type { ApiResponse } from "@src/res/type/ApiResponse"

export type ApiResponse_Events<T> = Readonly<{
    failure?: (reason: any) => void
    success?: (data: T) => void
    cleanup?: () => void
}>

export type Res_Event_Params<T> = Readonly<{
    request: Promise<ApiResponse<T>>
    events: Partial<ApiResponse_Events<T>>
}>

export const res_event = function <T>(params: Res_Event_Params<T>): void {
    params.request.then(response => {
        if (response.success) {
            params.events.success?.(response.body)
        } else {
            params.events.failure?.(response.reason)
        }
    }, reason => {
        params.events.failure?.(reason)
    }).finally(() => {
        params.events.cleanup?.()
    })
}
