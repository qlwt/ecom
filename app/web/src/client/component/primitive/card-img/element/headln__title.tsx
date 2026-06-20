import * as r from "react"
import cl from "classnames"
import st from "@client/component/primitive/card-img/style/core.module.scss"

export type EPCardImg__Headln__Title_Props = {
    readonly state_placeholder?: boolean

    readonly className?: string
    readonly children?: r.ReactNode
}

export const EPCardImg_Headln_Title: r.FC<EPCardImg__Headln__Title_Props> = props => {
    return <h3
        className={cl(st.headln__title, props.state_placeholder && st._placeholder, props.className)}
    >
        {props.children}
    </h3>
}

export default EPCardImg_Headln_Title
