import * as r from "react"
import cl from "classnames"
import st from "@client/component/primitive/card-img/style/core.module.scss"

export type EPCardImg__LayerFView_Props = {
    readonly state_error?: boolean
    readonly state_active?: boolean

    readonly style_shadow_size?: "normal" | "small"
    readonly style_shadow_type?: "normal" | "filter" | "none"

    readonly className?: string
    readonly children?: r.ReactNode
}

export const EPCardImg_LayerFView: r.FC<EPCardImg__LayerFView_Props> = props => {
    const nprop_style_shadow_size = props.style_shadow_size ?? "normal"
    const nprop_style_shadow_type = props.style_shadow_type ?? "normal"

    return <div
        className={cl(
            st.layerf,
            st.layerf_view,
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
    </div>
}

export default EPCardImg_LayerFView
