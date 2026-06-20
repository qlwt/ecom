import * as r from "react"
import cl from "classnames"
import st from "@client/component/primitive/card-img/style/core.module.scss"

export type EPCardImg__View_Props = {
    readonly className?: string
    readonly children?: r.ReactNode
}

export const EPCardImg_View = r.forwardRef<HTMLDivElement, EPCardImg__View_Props>((props, f_ref) => {
    return <div ref={f_ref} className={cl(st.view, props.className)}>
        {props.children}
    </div>
})

export default EPCardImg_View
