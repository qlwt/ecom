import st from "@client/component/feature/sign/style/core.module.scss"
import st_intext from "@client/component/primitive/in-text/style/white.module.scss"
import * as cst from "@fst/cst"
import { gv, remx } from "@fst/gstate"
import * as asr from "@qyu/atom-state-react"
import * as rfl from "@qyu/reactcmp-flow-control"
import { efsign__validate_email } from "@src/client/component/feature/sign/util/validate/email"
import { efsign__validate_pass } from "@src/client/component/feature/sign/util/validate/pass"
import { EPInText_IconBtn } from "@src/client/component/primitive/in-text/element/icon_btn"
import EPInText_Input from "@src/client/component/primitive/in-text/element/input"
import EPInText_ViewWeak from "@src/client/component/primitive/in-text/element/view_weak"
import EPPending_Spinner, { EPPending_Spinner_Size } from "@src/client/component/primitive/pending/element/spinner"
import { urlmap } from "@src/client/urlmap"
import cl from "classnames"
import * as r from "react"
import * as ri18 from "react-i18next"
import * as rr from "react-router"

export type EFSign__PageSignIn_Props = {

}

export const EFSign_PageSignIn: r.FC<EFSign__PageSignIn_Props> = props => {
    const { t } = ri18.useTranslation()

    const dispatch = asr.useAtomDispatch()
    const navigate = rr.useNavigate()

    const id_email = r.useId()
    const id_password = r.useId()

    const [pass, pass_set] = r.useState("")
    const [email, email_set] = r.useState("")

    const [pending, pending_set] = r.useState(false)
    const [hidepass, hidepass_set] = r.useState(true)

    const pass_error = !efsign__validate_pass(pass)
    const email_error = !efsign__validate_email(email)

    return <main className={st.root}>
        <div className={st.form}>
            <div className={cl(st.line, st._header)}>
                <h1 className={st.header}>
                    {t(`sign.header_signin`)}
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
                    value={email}
                    value_validator={v => v === "" || efsign__validate_email(email)}
                >
                    <EPInText_Input
                        id={id_email}
                        placeholder={t(`commons.placeholder_email`)}

                        event_value_change={email_set}
                    />
                </EPInText_ViewWeak>
            </div>

            <div className={cl(st.line, st._field)}>
                <div className={st.label__view}>
                    <label htmlFor={id_password} className={st.label__text}>
                        {t(`sign.label_password`)}
                    </label>

                    <rr.Link to={urlmap.shared.sign_restorepass_send()} className={st.label__link}>
                        {t(`sign.link_forgot_password`)}
                    </rr.Link>
                </div>

                <EPInText_ViewWeak
                    stmod={st_intext}
                    value={pass}

                    value_validator={v => v === "" || efsign__validate_pass(v)}
                >
                    <EPInText_Input
                        id={id_password}
                        placeholder={t("sign.placeholder_password")}
                        type={hidepass ? `password` : `text`}

                        event_value_change={pass_set}
                    />

                    <EPInText_IconBtn
                        icon={hidepass ? `eye_slash` : `eye_open`}

                        event_click={() => {
                            hidepass_set(o => !o)
                        }}
                    />
                </EPInText_ViewWeak>
            </div>

            <div className={cl(st.line, st._buttonsplit)}>
                <rr.Link to={urlmap.shared.sign_up()} className={st.form__btn}>
                    {t(`sign.act_signup`)}
                </rr.Link>

                <button
                    className={st.form__btn}
                    disabled={pass_error || email_error || pending}

                    onClick={() => {
                        pending_set(true)

                        dispatch(remx.auth.act.signin_email({
                            body: {
                                password: pass,
                                email: email.trim(),
                            },

                            config: {
                                events: {
                                    success: () => {
                                        navigate(urlmap.shared.root())
                                    },

                                    failure: (reason) => {
                                        switch (reason) {
                                            case cst.ServerError.BadAuth:
                                            case cst.ServerError.NotFound:
                                                dispatch(gv.report.act.push_error({
                                                    text: t(`popups.error.signin_forbiden`)
                                                }))

                                                break
                                            default:
                                                dispatch(gv.report.act.push_error({
                                                    text: t(`popups.error.signin_default`)
                                                }))

                                                break
                                        }
                                    },

                                    cleanup: () => {
                                        pending_set(false)
                                    },
                                },
                            },
                        }))
                    }}
                >
                    <rfl.CmpIf value={pending} fallback={() => t(`sign.act_continue`)}>
                        <div className={st.pendingfg}>
                            <EPPending_Spinner size={EPPending_Spinner_Size.Small} />
                        </div>
                    </rfl.CmpIf>
                </button>
            </div>
        </div>
    </main>
}

export default EFSign_PageSignIn
