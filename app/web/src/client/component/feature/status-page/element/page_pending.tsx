import st from "@client/component/feature/status-page/style/page.module.scss"
import EPPending_Spinner, { EPPending_Spinner_Size } from "@src/client/component/primitive/pending/element/spinner"
import * as r from "react"

export type EFStatusPage__Pending_Props = {
}

export const EFStatusPage_Pending: r.FC<EFStatusPage__Pending_Props> = props => {
    return <main className={st.root}>
        <EPPending_Spinner size={EPPending_Spinner_Size.Big} />
    </main>
}

export default EFStatusPage_Pending
