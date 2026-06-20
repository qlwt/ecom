import * as r from "react"
import cl from "classnames"
import st from "@client/component/primitive/card-img/style/core.module.scss"

const nprop_justify_new = function (justify: undefined | boolean | "end" | "start") {
    if (!justify) {
        return "end"
    }

    if (justify === true) {
        return "start"
    }

    return justify
}

export type EPCardImg__LayerBActions_Props = {
    readonly justify?: boolean | "end" | "start"
    readonly className?: string
    readonly children?: r.ReactNode
}

export const EPCardImg_LayerBActions: r.FC<EPCardImg__LayerBActions_Props> = props => {
    const nprop_justify = nprop_justify_new(props.justify)

    return <div
        className={cl(st.layerb_actions, {
            [st._justify_end!]: nprop_justify === "end",
            [st._justify_start!]: nprop_justify === "start",
        }, props.className)}
    >
        {props.children}
    </div>
}

export default EPCardImg_LayerBActions
