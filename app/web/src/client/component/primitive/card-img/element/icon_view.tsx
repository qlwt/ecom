import st from "@client/component/primitive/card-img/style/core.module.scss"
import cl from "classnames"
import * as r from "react"
import * as fac from "@fortawesome/fontawesome-svg-core"
import type { Icon_Shortcut } from "@src/client/util/icon/type/shortcut"
import { icon_new } from "@src/client/util/icon/new"
import * as faw from "@fortawesome/react-fontawesome"

export type EPCardImg__IconView_Props = {
    readonly state_error?: boolean

    readonly className?: string
    readonly icon: fac.IconDefinition | Icon_Shortcut
}

export const EPCardImg_IconView: r.FC<EPCardImg__IconView_Props> = props => {
    const icon = icon_new(props.icon)

    return <div
        className={cl(
            st.icon,
            st.icon_view,
            props.className,
            props.state_error && st._error,
        )}
    >
        <faw.FontAwesomeIcon icon={icon} />
    </div>
}

export default EPCardImg_IconView
