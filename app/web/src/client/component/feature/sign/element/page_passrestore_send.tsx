import st from "@client/component/feature/sign/style/core.module.scss"
import st_intext from "@client/component/primitive/in-text/style/white.module.scss"
import { efsign__validate_email } from "@src/client/component/feature/sign/util/validate/email"
import EPInText_Input from "@src/client/component/primitive/in-text/element/input"
import EPInText_ViewWeak from "@src/client/component/primitive/in-text/element/view_weak"
import { urlmap } from "@src/client/urlmap"
import cl from "classnames"
import * as r from "react"
import * as ri18 from "react-i18next"
import * as rr from "react-router"

export type EFSign__PagePassRestoreSend_Props = {

}

export const EFSign_PagePassRestoreSend: r.FC<EFSign__PagePassRestoreSend_Props> = props => {
    const navigate = rr.useNavigate()
    const { t } = ri18.useTranslation()

    const id_email = r.useId()

    const [email, email_set] = r.useState("")

    const email_error = !efsign__validate_email(email)

    return <main className={st.root}>
        <div className={st.form}>
            <div className={cl(st.line, st._header)}>
                <h1 className={st.header}>
                    {t(`sign.header_restore_password`)}
                </h1>
            </div>

            <div className={cl(st.line, st._field)}>
                <div className={st.label__view}>
                    <label htmlFor={id_email} className={st.label__text}>
                        {t(`commons.email`)}
                    </label>
                </div>

                <EPInText_ViewWeak
                    stmod={st_intext}
                    value={``}
                    value_validator={v => v === "" || efsign__validate_email(email)}
                >
                    <EPInText_Input
                        id={id_email}
                        event_value_change={email_set}
                        placeholder={t(`commons.placeholder_email`)}
                    />
                </EPInText_ViewWeak>
            </div>

            <div className={cl(st.line, st._button)}>
                <button
                    className={st.form__btn}
                    disabled={email_error}

                    onClick={() => {
                        navigate(urlmap.shared.sign_restorepass_fill())
                    }}
                >
                    {t(`sign.act_send_code`)}
                </button>
            </div>
        </div>
    </main>
}

export default EFSign_PagePassRestoreSend
