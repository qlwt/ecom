import st from "@client/component/primitive/card-img/style/core.module.scss"
import EPIcon_FA from "@src/client/component/primitive/icon/element/view"
import EPPending_Spinner, { EPPending_Spinner_Size } from "@src/client/component/primitive/pending/element/spinner"
import type { Icon_Shortcut } from "@src/client/util/icon/type/shortcut"
import cl from "classnames"
import * as r from "react"
import * as rfl from "@qyu/reactcmp-flow-control"

export type EPCardImg__Headln__Btn_Props = {
    readonly event_click?: VoidFunction

    readonly state_pending?: boolean
    readonly state_disabled?: boolean

    readonly style_anim_swiperight?: boolean

    readonly className?: string
    readonly className_content?: string
    readonly icon?: Icon_Shortcut | null
    readonly children?: r.ReactNode
}

export const EPCardImg_Headln_Btn: r.FC<EPCardImg__Headln__Btn_Props> = props => {
    const nprop_state_pending = props.state_pending ?? false
    const nprop_state_disabled = props.state_disabled ?? false
    const nprop_style_anim_swiperight = props.style_anim_swiperight ?? true
    const nprop_icon = props.icon === null ? null : props.icon ?? "arrow-right"

    return <button
        onClick={props.event_click}
        disabled={nprop_state_disabled || nprop_state_pending}

        className={cl(
            st.headln__action,
            st.headln__action_btn,
            {
                [st._pending!]: nprop_state_pending,
                [st._disabled!]: nprop_state_disabled,
                [st._anim_swiperight!]: nprop_style_anim_swiperight,
            },
            props.className
        )}
    >
        <div
            className={cl(
                st.headln__action__content,
                {
                    [st._pending!]: nprop_state_pending,
                    [st._disabled!]: nprop_state_disabled,
                },
                props.className_content,
            )}
        >
            {props.children}

            <rfl.CmpRequire value={[nprop_icon] as const}>
                {([nprop_icon]) => {
                    return <EPIcon_FA className={st.headln__action__icon} def={nprop_icon} />
                }}
            </rfl.CmpRequire>
        </div>

        <rfl.CmpIf value={props.state_pending}>
            <EPPending_Spinner size={EPPending_Spinner_Size.Small} />
        </rfl.CmpIf>
    </button>
}

export default EPCardImg_Headln_Btn
