import * as r from "react"
import cl from "classnames"
import st from "@client/component/primitive/card-img/style/core.module.scss"

export type EPCardImg__LayerFButton_Props = {
    readonly event_click?: VoidFunction

    readonly state_error?: boolean
    readonly state_active?: boolean
    readonly state_disabled?: boolean

    readonly style_shadow_size?: "normal" | "small"
    readonly style_shadow_type?: "normal" | "filter" | "none"

    readonly className?: string
    readonly children?: r.ReactNode
}

export const EPCardImg_LayerFButton = r.forwardRef<HTMLButtonElement, EPCardImg__LayerFButton_Props>((props, f_ref) => {
    const nprop_style_shadow_size = props.style_shadow_size ?? "normal"
    const nprop_style_shadow_type = props.style_shadow_type ?? "normal"

    return <button
        ref={f_ref}
        onClick={props.event_click}
        disabled={props.state_disabled}

        className={cl(st.layerf, st.layerf_btn, {
            [st._error!]: props.state_error,
            [st._active!]: props.state_active,
            [st._disabled!]: props.state_disabled,

            [st._shadow_type_normal!]: nprop_style_shadow_type === "normal",
            [st._shadow_type_filter!]: nprop_style_shadow_type === "filter",

            [st._shadow_size_small!]: nprop_style_shadow_size === "small",
            [st._shadow_size_normal!]: nprop_style_shadow_size === "normal",
        }, props.className)}
    >
        {props.children}
    </button>
})

export default EPCardImg_LayerFButton
