import * as r from "react"
import * as rr from "react-router"
import cl from "classnames"
import st from "@client/component/primitive/card-img/style/core.module.scss"

export type EPCardImg__LayerFLink_Props = {
    readonly href: string

    readonly state_active?: string
    readonly state_error?: boolean

    readonly style_shadow_size?: "normal" | "small"
    readonly style_shadow_type?: "normal" | "filter" | "none"

    readonly className?: string
    readonly children?: r.ReactNode
}

export const EPCardImg_LayerFLink: r.FC<EPCardImg__LayerFLink_Props> = props => {
    const nprop_style_shadow_size = props.style_shadow_size ?? "normal"
    const nprop_style_shadow_type = props.style_shadow_type ?? "normal"

    return <rr.Link
        to={props.href}
        className={cl(
            st.layerf,
            st.layerf_link,
            {
                [st._error!]: props.state_error,
                [st._active!]: props.state_active,

                [st._shadow_type_normal!]: nprop_style_shadow_type === "normal",
                [st._shadow_type_filter!]: nprop_style_shadow_type === "filter",

                [st._shadow_size_small!]: nprop_style_shadow_size === "small",
                [st._shadow_size_normal!]: nprop_style_shadow_size === "normal",
            },
            props.className
        )}
    >
        {props.children}
    </rr.Link>
}

export default EPCardImg_LayerFLink
