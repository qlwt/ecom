import * as r from "react"
import cl from "classnames"
import st from "@client/component/primitive/card-img/style/core.module.scss"

export type EPCardImg__VarBtn_Props = {
    readonly text: string

    readonly state_active?: boolean
    readonly event_click?: VoidFunction

    readonly className?: string
}

export const EPCardImg_VarBtn: r.FC<EPCardImg__VarBtn_Props> = props => {
    return <button
        onClick={props.event_click}
        disabled={props.state_active}
        className={cl(st.var, st.var_btn, props.state_active && st._active, props.className)}
    >
        <span className={st.var__text}>
            {props.text}
        </span>
    </button>
}

export default EPCardImg_VarBtn
