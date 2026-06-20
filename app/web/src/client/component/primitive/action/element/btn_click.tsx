import * as r from "react"
import cl from "classnames"
import st from "@client/component/primitive/action/style/core.module.scss"
import type { FnSetterStateles } from "@src/client/type/fns"
import * as faw from "@fortawesome/react-fontawesome"
import * as fac from "@fortawesome/fontawesome-svg-core"
import type { Icon_Shortcut } from "@src/client/util/icon/type/shortcut"
import { icon_new } from "@src/client/util/icon/new"

export type EPAction__BtnClick_Props = {
    readonly event_click: FnSetterStateles<boolean>

    readonly state_active?: boolean

    readonly style_root?: boolean
    readonly style_redclr?: boolean

    readonly style_shadow_type?: "normal" | "none"

    readonly className?: string
    readonly children?: r.ReactNode
    readonly icon?: fac.IconDefinition | Icon_Shortcut
}

export const EPAction_BtnClick = r.forwardRef<HTMLButtonElement, EPAction__BtnClick_Props>((props, f_ref) => {
    const nprop_style_shadow_type = props.style_shadow_type ?? "normal"

    return <button
        ref={f_ref}

        onClick={() => {
            props.event_click(!props.state_active)
        }}

        className={cl(st.btn, st.btn_click, {
            [st.root!]: props.style_root,
            [st._active!]: props.state_active,
            [st._style_redclr!]: props.style_redclr,
            [st._shadow_type_normal!]: nprop_style_shadow_type === "normal",
        }, props.className)}
    >
        {props.icon ? <faw.FontAwesomeIcon icon={icon_new(props.icon)} /> : props.children}
    </button>
})

export default EPAction_BtnClick
