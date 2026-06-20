import st from "@client/component/feature/status-page/style/page.module.scss"
import * as r from "react"
import * as ri18 from "react-i18next"

export type EFStatusPage__NotFound_Props = {
}

export const EFStatusPage_NotFound: r.FC<EFStatusPage__NotFound_Props> = props => {
    const { t } = ri18.useTranslation()

    return <main className={st.root}>
        <h1 className={st.code}>
            404
        </h1>

        <h1 className={st.message}>
            {t(`errorpage.notfound.message`)}
        </h1>
    </main>
}

export default EFStatusPage_NotFound
