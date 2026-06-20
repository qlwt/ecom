import st from "@client/component/primitive/card-img/style/core.module.scss"
import cl from "classnames"
import * as r from "react"
import * as fac from "@fortawesome/fontawesome-svg-core"
import type { Icon_Shortcut } from "@src/client/util/icon/type/shortcut"
import { icon_new } from "@src/client/util/icon/new"
import * as faw from "@fortawesome/react-fontawesome"

export type EPCardImg__IconBtn_Props = {
    readonly state_error?: boolean

    readonly icon: fac.IconDefinition | Icon_Shortcut
    readonly event_click: VoidFunction
    readonly className?: string
}

export const EPCardImg_IconBtn: r.FC<EPCardImg__IconBtn_Props> = props => {
    const icon = icon_new(props.icon)

    return <button
        onClick={props.event_click}
        className={cl(
            st.icon,
            st.icon_btn,
            props.state_error && st._error,
            props.className,
        )}
    >
        <faw.FontAwesomeIcon icon={icon} />
    </button>
}

export default EPCardImg_IconBtn
