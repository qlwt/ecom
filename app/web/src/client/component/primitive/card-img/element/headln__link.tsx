import st from "@client/component/primitive/card-img/style/core.module.scss"
import EPIcon_FA from "@src/client/component/primitive/icon/element/view"
import type { Icon_Shortcut } from "@src/client/util/icon/type/shortcut"
import cl from "classnames"
import * as r from "react"
import * as rr from "react-router"

export type EPCardImg__Headln__Link_Props = {
    readonly href: string

    readonly style_anim_swiperight?: boolean

    readonly event_click?: VoidFunction

    readonly className?: string
    readonly className_content?: string
    readonly icon?: Icon_Shortcut
    readonly children?: r.ReactNode
}

export const EPCardImg_Headln_Link: r.FC<EPCardImg__Headln__Link_Props> = props => {
    const nprop_style_anim_swiperight = props.style_anim_swiperight ?? true

    return <rr.Link
        to={props.href}
        onClick={props.event_click}

        className={cl(
            st.headln__action,
            st.headln__action_link,
            {
                [st._anim_swiperight!]: nprop_style_anim_swiperight,
            },
            props.className
        )}
    >
        <div
            className={cl(
                st.headln__action__content,
                props.className_content,
            )}
        >
            {props.children}

            <EPIcon_FA className={st.headln__action__icon} def={props.icon ?? "arrow-right"} />
        </div>
    </rr.Link>
}

export default EPCardImg_Headln_Link
