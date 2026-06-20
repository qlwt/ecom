import type { FnSetterStateles } from "@src/client/type/fns"
import * as r from "react"

export type EPInText_StyleModule = {
    readonly [K in (
        | "view"
        | "input"
        | "icon"
        | "icon_btn"
        | "icon_btn__content"
        | "block_comment"
        | "_error"
        | "_pending"
        | "_disabled"
        | "_highlight"
    )]?: string | null
}

export type EPInText_State_ValueConfig = {
    readonly event_value_change?: FnSetterStateles<string>
    readonly event_value_change_valid?: FnSetterStateles<string>
}

export type EPInText_State = {
    readonly value: string
    readonly value_kind: "default" | "controlled"
    readonly value_validator?: (value: string) => boolean
    readonly value_change: (value: string, config: EPInText_State_ValueConfig) => void

    readonly state_error: boolean
    readonly state_disabled: boolean

    readonly stmod?: EPInText_StyleModule
    readonly ref_input: r.RefObject<HTMLInputElement | null>
}
