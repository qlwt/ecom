import * as r from "react"
import cl from "classnames"
import st from "@client/component/primitive/card-img/style/core.module.scss"

export type EPCardImg__LayoutMainCol_Props = {
    readonly className?: string
    readonly children?: r.ReactNode
}

export const EPCardImg_LayoutMainCol: r.FC<EPCardImg__LayoutMainCol_Props> = props => {
    return <div className={cl(st.layout_maincol, props.className)}>
        {props.children}
    </div>
}

export default EPCardImg_LayoutMainCol
