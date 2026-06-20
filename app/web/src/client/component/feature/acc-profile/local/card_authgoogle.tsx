import st from "@client/component/feature/acc-profile/style/card_auth.module.scss"
import * as cc from "@fst/config/client"
import * as r from "react"
import * as ri18 from "react-i18next"

export type ELAccProfile__CardAuthGoogle_Props = {
    readonly node: cc.RemDef["acc_authemail"]["joins"]["core"]
}

export const ELAccProfile_CardAuthGoogle: r.FC<ELAccProfile__CardAuthGoogle_Props> = props => {
    const { t } = ri18.useTranslation()

    return <div className={st.root}>
        <div className={st.head}>
            <div className={st.head__left}>
                <h3 className={st.head__title}>
                    {t(`user.header_googleauth`)}:
                </h3>

                <span className={st.head__email}>
                    {props.node.email}
                </span>
            </div>
        </div>
    </div>
}

export default ELAccProfile_CardAuthGoogle
