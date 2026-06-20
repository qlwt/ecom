import * as r from "react"
import cl from "classnames"
import st from "@client/component/primitive/card-img/style/core.module.scss"

export type EPCardImg__LayoutInfo_Props = {
    readonly className?: string
    readonly children?: r.ReactNode
}

export const EPCardImg_LayoutInfo: r.FC<EPCardImg__LayoutInfo_Props> = props => {
    return <div className={cl(st.layout_info, props.className)}>
        {props.children}
    </div>
}

export default EPCardImg_LayoutInfo
