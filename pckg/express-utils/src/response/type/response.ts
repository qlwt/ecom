export type Response_Body_Generic = number | string | object | readonly any[] | Buffer | null

export type Response<Data extends Response_Body_Generic> = {
    readonly body: Data 
    readonly status: number
    readonly headers: Readonly<Record<string, string>>
}
