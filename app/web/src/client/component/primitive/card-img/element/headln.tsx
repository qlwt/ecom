import * as r from "react"
import cl from "classnames"
import st from "@client/component/primitive/card-img/style/core.module.scss"

export type EPCardImg__Headln_Props = {
    readonly style_center?: boolean

    readonly className?: string
    readonly children?: r.ReactNode
}

export const EPCardImg_Headln: r.FC<EPCardImg__Headln_Props> = props => {
    return <div
        className={cl(st.headln, {
            [st._center!]: props.style_center,
        }, props.className)}
    >
        {props.children}
    </div>
}

export default EPCardImg_Headln
