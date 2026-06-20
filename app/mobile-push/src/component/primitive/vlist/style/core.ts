import * as rn from "react-native"

type ParamsPlaceholder = {
    readonly height: number
}

type ParamsPending = {
    readonly height: number
}

export const epvlist__stf_core = {
    scroll: () => ({
        flexGrow: 1,
        flexShrink: 1,
    } satisfies rn.ViewStyle),

    list: () => ({
        flexGrow: 0,
        flexShrink: 0,
    } satisfies rn.ViewStyle),

    pending: (params: ParamsPending) => ({
        position: "relative",

        flexGrow: 0,
        flexShrink: 0,
        height: params.height,
        alignItems: "center",
        justifyContent: "center",
    } satisfies rn.ViewStyle),

    placeholder: (params: ParamsPlaceholder) => ({
        flexGrow: 0,
        flexShrink: 0,
        height: params.height
    } satisfies rn.ViewStyle),
}
