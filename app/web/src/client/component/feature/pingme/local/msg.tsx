import * as r from "react"
import st from "@client/component/feature/pingme/style/index.module.scss"
import cl from "classnames"

export type ELPingMe__Msg_Props = {
    readonly kind: "mine" | "partner"

    readonly children?: r.ReactNode
}

export const ELPingMe_Msg: r.FC<ELPingMe__Msg_Props> = props => {
    return <div
        className={cl(
            st.msg__root,
            props.kind === "mine" && st._kind_mine,
            props.kind === "partner" && st._kind_partner
        )}
    >
        {props.children}
    </div>
}

export default ELPingMe_Msg
