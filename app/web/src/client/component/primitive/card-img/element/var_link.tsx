import * as r from "react"
import cl from "classnames"
import st from "@client/component/primitive/card-img/style/core.module.scss"
import * as rr from "react-router"

export type EPCardImg__VarLink_Props = {
    readonly href: string
    readonly text: string

    readonly state_active?: boolean

    readonly className?: string
}

export const EPCardImg_VarLink: r.FC<EPCardImg__VarLink_Props> = props => {
    return <rr.Link
        to={props.href}
        className={cl(st.var, st.var_link, props.className)}
    >
        <span className={st.var__text}>
            {props.text}
        </span>
    </rr.Link>
}

export default EPCardImg_VarLink
