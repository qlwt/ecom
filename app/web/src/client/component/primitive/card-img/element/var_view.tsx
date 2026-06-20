import * as r from "react"
import cl from "classnames"
import st from "@client/component/primitive/card-img/style/core.module.scss"

export type EPCardImg__VarView_Props = {
    readonly text: string

    readonly status_placeholder?: boolean

    readonly className?: string
}

export const EPCardImg_VarView: r.FC<EPCardImg__VarView_Props> = props => {
    const nprop_status_placeholder = props.status_placeholder ?? false

    return <div
        className={cl(
            st.var,
            st.var_view,
            nprop_status_placeholder && st._status_placeholder,
            props.className
        )}
    >
        <span className={st.var__text}>
            {props.text}
        </span>
    </div>
}

export default EPCardImg_VarView
