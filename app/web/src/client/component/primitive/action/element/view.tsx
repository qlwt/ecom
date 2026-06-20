import * as r from "react"
import cl from "classnames"
import st from "@client/component/primitive/action/style/core.module.scss"

export type EPAction__View_Props = {
    readonly style_root?: boolean

    readonly state_active?: boolean
    readonly state_disabled?: boolean

    readonly style_direction?: "row" | "column"
    readonly style_shadow_type?: "normal" | "none"

    readonly className?: string
    readonly children?: r.ReactNode
}

export const EPAction_View: r.FC<EPAction__View_Props> = props => {
    const nprop_style_direction = props.style_direction ?? "row"
    const nprop_style_shadow_type = props.style_shadow_type ?? "normal"

    return <div
        className={cl(st.view, {
            [st.root!]: props.style_root,
            [st._active!]: props.state_active,
            [st._disabled!]: props.state_disabled,
            [st._direction_row!]: nprop_style_direction === "row",
            [st._direction_column!]: nprop_style_direction === "column",
            [st._shadow_type_normal!]: nprop_style_shadow_type === "normal",
        }, props.className)}
    >
        {props.children}
    </div>
}

export default EPAction_View
