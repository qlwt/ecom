import st from "@client/component/feature/acc-profile/style/card_auth.module.scss"
import stheme_intext_form from "@client/component/primitive/in-text/style/white.module.scss"
import * as capi from "@fst/capi"
import * as cc from "@fst/config/client"
import * as cst from "@fst/cst"
import { gv } from "@fst/gstate"
import * as asr from "@qyu/atom-state-react"
import EPCardImg_Headln_Btn from "@src/client/component/primitive/card-img/element/headln__btn"
import { EPInText_IconBtn } from "@src/client/component/primitive/in-text/element/icon_btn"
import EPInText_Input from "@src/client/component/primitive/in-text/element/input"
import EPInText_ViewStrong from "@src/client/component/primitive/in-text/element/view_strong"
import { useAuthAcc } from "@src/client/hook/auth/acc"
import cl from "classnames"
import * as r from "react"
import * as ri18 from "react-i18next"

export type ELAccProfile__CardAuthEmail_Props = {
    readonly node: cc.RemDef["acc_authemail"]["joins"]["core"]
}

export const ELAccProfile_CardAuthEmail: r.FC<ELAccProfile__CardAuthEmail_Props> = props => {
    const { t } = ri18.useTranslation()
    const dispatch = asr.useAtomDispatch()

    const acc = useAuthAcc()

    const [pass_hide, pass_hide_set] = r.useState(true)

    const pass_old_id = r.useId()
    const [pass_old, pass_old_set] = r.useState("")

    const pass_new_id = r.useId()
    const [pass_new, pass_new_set] = r.useState("")

    const pass_repeat_id = r.useId()
    const [pass_repeat, pass_repeat_set] = r.useState("")

    const [status_pending, status_pending_set] = r.useState(false)

    return <div className={st.root}>
        <div className={st.head}>
            <div className={st.head__left}>
                <h3 className={st.head__title}>
                    {t(`user.header_emailauth`)}:
                </h3>

                <span className={st.head__email}>
                    {props.node.email}
                </span>
            </div>
        </div>

        <div className={st.line_changepass}>
            <div className={cl(st.field)}>
                <label className={st.label} htmlFor={pass_old_id}>
                    {t(`user.label_oldpass`)}
                </label>

                <div className={st.line_changepass__head}>
                    <EPInText_ViewStrong
                        value={pass_old}
                        stmod={stheme_intext_form}
                        state_disabled={status_pending}
                    >
                        <EPInText_Input
                            type={pass_hide ? "password" : "text"}
                            id={pass_old_id}
                            event_value_change={pass_old_set}
                            placeholder={t(`user.placeholder_oldpass`)}
                        />

                        <EPInText_IconBtn
                            icon={pass_hide ? `eye_open` : `eye_slash`}

                            event_click={() => {
                                pass_hide_set(t => !t)
                            }}
                        />
                    </EPInText_ViewStrong>

                    <EPCardImg_Headln_Btn
                        state_pending={status_pending}

                        state_disabled={(
                            pass_old.trim() === ""
                            || pass_new.trim().length < 8
                            || pass_repeat.trim() !== pass_new.trim()
                        )}

                        event_click={() => {
                            if (!acc) { return }

                            status_pending_set(true)

                            capi.send_restx_auth_match_email_patch({
                                body: {
                                    id: props.node.id,
                                    owner: acc.id,

                                    verification: {
                                        password: pass_old,
                                    },

                                    patch: {
                                        password: pass_new,
                                    },
                                },

                                config: {
                                    events: {
                                        failure: reason => {
                                            switch (reason) {
                                                case cst.ServerError.NotFound: {
                                                    dispatch(gv.report.act.push_error({
                                                        text: t(`popups.error.auth_changepass_default`),
                                                    }))

                                                    break
                                                }
                                                default: {
                                                    dispatch(gv.report.act.push_error({
                                                        text: t(`popups.error.auth_changepass_default`),
                                                    }))

                                                    break
                                                }
                                            }
                                        },

                                        success: () => {
                                            dispatch(gv.report.act.push_info({
                                                text: t(`popups.info.auth_changepass_default`)
                                            }))

                                            pass_old_set("")
                                            pass_new_set("")
                                            pass_repeat_set("")
                                        },

                                        cleanup: () => {
                                            status_pending_set(false)
                                        },
                                    },
                                }
                            })
                        }}
                    >
                        {t(`user.act_changepass`)}
                    </EPCardImg_Headln_Btn>
                </div>
            </div>

            <div className={st.line_changepass__newpass}>
                <div className={st.field}>
                    <label className={st.label} htmlFor={pass_new_id}>
                        {t(`user.label_newpass`)}
                    </label>

                    <EPInText_ViewStrong
                        value={pass_new}
                        stmod={stheme_intext_form}
                        state_disabled={status_pending}

                        value_validator={v => {
                            const trimmed = v.trim()

                            return trimmed.length === 0 || trimmed.length >= 8
                        }}
                    >
                        <EPInText_Input
                            type={pass_hide ? "password" : "text"}
                            id={pass_new_id}
                            placeholder={t(`user.placeholder_newpass`)}
                            event_value_change={pass_new_set}
                        />

                        <EPInText_IconBtn
                            icon={pass_hide ? `eye_open` : `eye_slash`}

                            event_click={() => {
                                pass_hide_set(t => !t)
                            }}
                        />
                    </EPInText_ViewStrong>
                </div>

                <div className={st.field}>
                    <label className={st.label} htmlFor={pass_repeat_id}>
                        {t(`user.label_repeatpass`)}
                    </label>

                    <EPInText_ViewStrong
                        value={pass_repeat}
                        stmod={stheme_intext_form}
                        state_disabled={status_pending}

                        value_validator={v => {
                            const trimmed = v.trim()

                            return trimmed.length === 0 || trimmed === pass_new.trim()
                        }}
                    >
                        <EPInText_Input
                            type={pass_hide ? "password" : "text"}
                            id={pass_repeat_id}
                            event_value_change={pass_repeat_set}
                            placeholder={t(`user.placeholder_repeatpass`)}
                        />

                        <EPInText_IconBtn
                            icon={pass_hide ? `eye_open` : `eye_slash`}

                            event_click={() => {
                                pass_hide_set(t => !t)
                            }}
                        />
                    </EPInText_ViewStrong>
                </div>
            </div>
        </div>
    </div>
}

export default ELAccProfile_CardAuthEmail
