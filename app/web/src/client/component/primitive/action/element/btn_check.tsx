import st from "@client/component/primitive/action/style/core.module.scss"
import type * as fac from "@fortawesome/fontawesome-svg-core"
import * as faw from "@fortawesome/react-fontawesome"
import type { FnSetterStateles } from "@src/client/type/fns"
import { icon_new } from "@src/client/util/icon/new"
import type { Icon_Shortcut } from "@src/client/util/icon/type/shortcut"
import cl from "classnames"
import * as r from "react"

export type EPAction__BtnCheck_Props = {
    readonly state_active: boolean
    readonly event_click: FnSetterStateles<boolean>

    readonly style_root?: boolean
    readonly style_redclr?: boolean

    readonly style_shadow_type?: "normal" | "none"

    readonly className?: string
    readonly children?: r.ReactNode
    readonly icon?: fac.IconDefinition | Icon_Shortcut
}

export const EPAction_BtnCheck = r.forwardRef<HTMLButtonElement, EPAction__BtnCheck_Props>((props, f_ref) => {
    const nprop_style_shadow_type = props.style_shadow_type ?? "normal"

    return <button
        ref={f_ref}

        disabled={props.state_active}

        onClick={() => {
            props.event_click(!props.state_active)
        }}

        className={cl(st.btn, st.btn_check, {
            [st.root!]: props.style_root,
            [st._active!]: props.state_active,
            [st._style_redclr!]: props.style_redclr,
            [st._shadow_type_normal!]: nprop_style_shadow_type === "normal",
        }, props.className)}
    >
        {props.icon ? <faw.FontAwesomeIcon icon={icon_new(props.icon)} /> : props.children}
    </button>
})

export default EPAction_BtnCheck
