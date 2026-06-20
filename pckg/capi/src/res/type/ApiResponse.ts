export type ApiResponse_Infer<Src extends ApiResponse<any>> = (
    Src extends ApiResponse_Success<infer T> ? T : never
)

export type ApiResponse_Success<T> = Readonly<{
    success: true
    body: T
}>

export type ApiResponse_Failure = Readonly<{
    success: false
    reason: any
}>

export type ApiResponse<T> = (
    | ApiResponse_Success<T>
    | ApiResponse_Failure
)
