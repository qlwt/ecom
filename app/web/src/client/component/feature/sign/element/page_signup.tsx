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
import { useAuthAcc } from "@src/client/hook/auth/acc"
import { urlmap } from "@src/client/urlmap"
import cl from "classnames"
import * as r from "react"
import * as ri18 from "react-i18next"
import * as rr from "react-router"

export type EFSign__PageSignUp_Props = {

}

export const EFSign_PageSignUp: r.FC<EFSign__PageSignUp_Props> = props => {
    const { t } = ri18.useTranslation()

    const navigate = rr.useNavigate()
    const dispatch = asr.useAtomDispatch()

    const acc = useAuthAcc()
    const id_email = r.useId()
    const id_pass = r.useId()
    const id_passrep = r.useId()

    const [hidepass, hidepass_set] = r.useState(true)

    const [pass, pass_set] = r.useState("")
    const [email, email_set] = r.useState("")
    const [passrep, passrep_set] = r.useState("")
    const [pending, pending_set] = r.useState(false)

    const passrep_error = passrep !== pass
    const pass_error = !efsign__validate_pass(pass)
    const email_error = !efsign__validate_email(email)

    return <main className={st.root}>
        <div className={st.form}>
            <div className={cl(st.line, st._header)}>
                <h1 className={st.header}>
                    {t("sign.header_signup")}
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

                    value_validator={value => value === "" || efsign__validate_email(value)}
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
                    <label htmlFor={id_pass} className={st.label__text}>
                        {t(`sign.label_password`)}
                    </label>
                </div>

                <EPInText_ViewWeak
                    value={pass}
                    stmod={st_intext}
                    value_validator={value => value === "" || efsign__validate_pass(value)}
                >
                    <EPInText_Input
                        id={id_pass}
                        type={hidepass ? `password` : `text`}
                        placeholder={t(`sign.placeholder_password`)}

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

            <div className={cl(st.line, st._field)}>
                <div className={st.label__view}>
                    <label htmlFor={id_passrep} className={st.label__text}>
                        {t(`sign.label_repeat_password`)}
                    </label>
                </div>

                <EPInText_ViewWeak
                    stmod={st_intext}
                    value={passrep}
                    value_validator={value => value === "" || value === pass}
                >
                    <EPInText_Input
                        id={id_passrep}
                        type={hidepass ? `password` : `text`}
                        placeholder={t(`sign.placeholder_repeat_password`)}

                        event_value_change={passrep_set}
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
                <rr.Link to={urlmap.shared.sign_in()} className={st.form__btn}>
                    {t(`sign.act_signin`)}
                </rr.Link>

                <button
                    className={st.form__btn}
                    disabled={pass_error || passrep_error || email_error || pending}

                    onClick={() => {
                        if (!acc) { return }

                        pending_set(true)

                        dispatch(remx.auth.act.match_email_post({
                            body: {
                                password: pass,
                                owner: acc.id,
                                email: email.trim(),
                            },

                            config: {
                                events: {
                                    success: () => {
                                        navigate(urlmap.shared.root())
                                    },

                                    failure: reason => {
                                        console.log(reason)
                                        switch (reason) {
                                            case cst.ServerError.BadReq:
                                                dispatch(gv.report.act.push_error({
                                                    text: t(`popups.error.signup_emailtaken`)
                                                }))

                                                break
                                            default:
                                                dispatch(gv.report.act.push_error({
                                                    text: t(`popups.error.signup_default`)
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

export default EFSign_PageSignUp
