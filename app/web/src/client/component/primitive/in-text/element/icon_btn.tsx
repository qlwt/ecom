import * as fac from "@fortawesome/fontawesome-svg-core"
import * as rfl from "@qyu/reactcmp-flow-control"
import EPIcon_FA from "@src/client/component/primitive/icon/element/view"
import { EPInText_Context } from "@src/client/component/primitive/in-text/element/context"
import st from "@src/client/component/primitive/in-text/style/core.module.scss"
import EPPending_Spinner, { EPPending_Spinner_Size } from "@src/client/component/primitive/pending/element/spinner"
import type { Icon_Shortcut } from "@src/client/util/icon/type/shortcut"
import cl from "classnames"
import * as r from "react"

export type EPInText__IconBtn_Props = {
    readonly className?: string
    readonly className__content?: string
    readonly status_disabled?: boolean
    readonly status_pending?: boolean
    readonly style_highlight?: boolean
    readonly event_click?: VoidFunction
    readonly icon: fac.IconDefinition | Icon_Shortcut
}

export const EPInText_IconBtn: r.FC<EPInText__IconBtn_Props> = props => {
    const nprop_status_pending = props.status_pending ?? false
    const nprop_style_highlight = props.style_highlight ?? false
    const nprop_status_disabled = props.status_disabled ?? false

    const state = r.useContext(EPInText_Context)

    if (!state) { throw new Error(`Using element outside of EPInText_Context`) }

    return <button
        disabled={nprop_status_disabled || nprop_status_pending}

        className={cl(
            st.intext__icon,
            st.intext__icon_btn,
            nprop_status_pending && st._pending,
            nprop_status_disabled && st._disabled,
            nprop_style_highlight && st._highlight,
            state.stmod?.icon,
            state.stmod?.icon_btn,
            nprop_status_disabled && state.stmod?._disabled,
            nprop_style_highlight && state.stmod?._highlight,
            nprop_status_pending && state.stmod?._pending,
            props.className,
        )}

        onClick={() => {
            props.event_click?.()
        }}
    >
        <span
            className={cl(
                st.icon_btn__content,
                nprop_status_pending && st._pending,
                nprop_status_disabled && st._disabled,
                state.stmod?.icon_btn__content,
                nprop_status_disabled && state.stmod?._disabled,
                nprop_status_pending && state.stmod?._pending,
                props.className__content,
            )}
        >
            <EPIcon_FA def={props.icon} />
        </span>

        <rfl.CmpIf value={nprop_status_pending}>
            <EPPending_Spinner size={EPPending_Spinner_Size.Small} />
        </rfl.CmpIf>
    </button>
}
