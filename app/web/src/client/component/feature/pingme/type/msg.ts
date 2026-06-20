export enum EFPingMe__MsgKind {
    UsrPhone,
    ResPending,
    ResSuccess,
    ResFailInternal,
    ResFailAlreadyPending
}

export type EFPingMe_MsgPhone = {
    readonly id: string
    readonly phone: string
    readonly kind: EFPingMe__MsgKind.UsrPhone
}

export type EFPingMe_MsgRes = {
    readonly id: string
    readonly kind: (
        | EFPingMe__MsgKind.ResPending
        | EFPingMe__MsgKind.ResSuccess
        | EFPingMe__MsgKind.ResFailInternal
        | EFPingMe__MsgKind.ResFailAlreadyPending
    )
}

export type EFPingMe_Msg = (
    | EFPingMe_MsgPhone
    | EFPingMe_MsgRes
)
