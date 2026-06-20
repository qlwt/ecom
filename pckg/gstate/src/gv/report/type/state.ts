export enum GVReport_Kind {
    Info,
    Error,
}

export type GVReport_State = {
    readonly id: string
    readonly text: string
    readonly kind: GVReport_Kind
    readonly creation_date: number
}
