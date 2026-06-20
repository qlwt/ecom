import st from "@client/component/primitive/card-img/style/core.module.scss"
import cl from "classnames"
import * as r from "react"
import * as fac from "@fortawesome/fontawesome-svg-core"
import type { Icon_Shortcut } from "@src/client/util/icon/type/shortcut"
import { icon_new } from "@src/client/util/icon/new"
import * as faw from "@fortawesome/react-fontawesome"
import * as rr from "react-router"

export type EPCardImg__IconLink_Props = {
    readonly state_error?: boolean

    readonly href: string
    readonly className?: string
    readonly icon: fac.IconDefinition | Icon_Shortcut
}

export const EPCardImg_IconLink: r.FC<EPCardImg__IconLink_Props> = props => {
    const icon = icon_new(props.icon)

    return <rr.Link
        to={props.href}

        className={cl(
            st.icon,
            st.icon_link,
            props.className,
            props.state_error && st._error,
        )}
    >
        <faw.FontAwesomeIcon icon={icon} />
    </rr.Link>
}

export default EPCardImg_IconLink
