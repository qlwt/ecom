import st from "@client/component/feature/console-contacts/style/card_contact.module.scss"
import EPCardContact_ViewEdit from "@src/client/component/primitive/card-contact/element/view_edit"
import * as r from "react"
import * as cc from "@fst/config/client"

export type ELConContacts__CardContact_Props = {
    readonly node: cc.RemDef["contact_message"]["joins"]["core"]
}

export const ELConContacts_CardContact: r.FC<ELConContacts__CardContact_Props> = props => {
    return <div className={st.root}>
        <EPCardContact_ViewEdit node={props.node} />
    </div>
}

export default ELConContacts_CardContact
