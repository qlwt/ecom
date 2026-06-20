import st from "@client/component/feature/console-commisions/style/card_commision.module.scss"
import * as cc from "@fst/config/client"
import EPCardCommision_ViewEdit from "@src/client/component/primitive/card-commision/element/view_edit"
import * as r from "react"

export type ELConCommisions__CardCommision_Props = {
    readonly node: cc.RemDef["commision"]["joins"]["core"]
}

export const ELConCommisions_CardCommision: r.FC<ELConCommisions__CardCommision_Props> = props => {
    return <div className={st.root}>
        <EPCardCommision_ViewEdit node={props.node} />
    </div>
}

export default ELConCommisions_CardCommision
