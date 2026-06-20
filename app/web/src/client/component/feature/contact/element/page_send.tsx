import * as dbdef from "@fst/db-default"
import { gv, rem } from "@fst/gstate"
import * as asr from "@qyu/atom-state-react"
import ELContact_Field from "@src/client/component/feature/contact/local/field"
import st from "@src/client/component/feature/contact/style/page.module.scss"
import EPCardImg_Headln_Btn from "@src/client/component/primitive/card-img/element/headln__btn"
import { EPInText_BlockComment } from "@src/client/component/primitive/in-text/element/block_comment"
import EPInText_Input from "@src/client/component/primitive/in-text/element/input"
import EPInText_ViewWeak from "@src/client/component/primitive/in-text/element/view_weak"
import stheme_intext from "@src/client/component/primitive/in-text/style/white.module.scss"
import EPInTextArea_Area from "@src/client/component/primitive/in-textarea/element/area"
import stheme_intextarea from "@src/client/component/primitive/in-textarea/style/theme_white.module.scss"
import { useAuthAcc } from "@src/client/hook/auth/acc"
import cl from "classnames"
import * as r from "react"
import * as ri18 from "react-i18next"
import { v7 as uuid } from "uuid"
import * as z from "zod"

const cst_topic_maxlength = 255
const cst_topic_minlength = 10
const cst_content_minlength = 10

const validate_email = function(value: string, strict: boolean) {
    if (!strict) {
        if (value === "") {
            return true
        }
    }

    return z.email().safeParse(value).success
}

const validate_topic = function(value: string, strict: boolean) {
    if (!strict) {
        if (value === "") {
            return true
        }
    }

    return value.length < cst_topic_maxlength && value.length > cst_topic_minlength
}

const validate_content = function(value: string, strict: boolean) {
    if (!strict) {
        if (value === "") {
            return true
        }
    }

    return value.length > cst_content_minlength
}

export const EFContact_Page: r.FC = function() {
    const { t } = ri18.useTranslation()
    const dispatch = asr.useAtomDispatch()

    const acc = useAuthAcc()

    const [status_pending, status_pending_set] = r.useState(false)

    const id_email = r.useId()
    const [field_email, field_email_set] = r.useState("")

    const id_topic = r.useId()
    const [field_topic, field_topic_set] = r.useState("")

    const id_content = r.useId()
    const [field_content, field_content_set] = r.useState("")

    const [verify_strict, verify_strict_set] = r.useState(false)

    const verify_valid = (
        validate_email(field_email, true)
        && validate_topic(field_topic, true)
        && validate_content(field_content, true)
    )

    return <main className={st.page}>
        <section className={cl(st.sector, st.form)}>
            <ELContact_Field title={t("commons.email") + `*`} target_id={id_email}>
                <EPInText_ViewWeak
                    value={field_email}
                    stmod={stheme_intext}
                    state_disabled={status_pending}

                    value_validator={v => {
                        return validate_email(v, verify_strict)
                    }}
                >
                    <EPInText_Input
                        id={id_email}
                        type={`email`}
                        event_value_change={field_email_set}
                        placeholder={t("commons.placeholder_email")}
                    />
                </EPInText_ViewWeak>
            </ELContact_Field>

            <ELContact_Field title={t(`contact.label_topic`) + `*`} target_id={id_topic}>
                <EPInText_ViewWeak
                    value={field_topic}
                    stmod={stheme_intext}
                    state_disabled={status_pending}

                    value_validator={v => {
                        return validate_topic(v, verify_strict)
                    }}
                >
                    <EPInText_Input
                        id={id_topic}
                        type={`text`}
                        event_value_change={field_topic_set}
                        placeholder={t(`contact.placeholder_topic`)}
                    />

                    <EPInText_BlockComment>
                        {`${field_topic.length.toString()} / ${cst_topic_maxlength}`}
                    </EPInText_BlockComment>
                </EPInText_ViewWeak>
            </ELContact_Field>

            <ELContact_Field title={t("contact.label_content") + `*`} target_id={id_content}>
                <EPInTextArea_Area
                    rows={20}
                    id={id_content}
                    stmod={stheme_intextarea}
                    value_default={field_content}
                    state_disabled={status_pending}
                    event_value_change={field_content_set}
                    placeholder={t("contact.placeholder_content")}

                    value_validator={v => {
                        return validate_content(v, verify_strict)
                    }}
                />
            </ELContact_Field>

            <div className={st.line_submit}>
                <EPCardImg_Headln_Btn
                    state_disabled={verify_strict && !verify_valid}
                    state_pending={status_pending}

                    event_click={() => {
                        if (verify_valid) {
                            if (!acc) {
                                dispatch(gv.report.act.push_error({
                                    text: t(`popups.error.contact_default`)
                                }))

                                return
                            }

                            status_pending_set(true)

                            dispatch(rem.contact_message.act.post({
                                body: [{
                                    core: {
                                        ...dbdef.table.contact_message,

                                        id: uuid(),

                                        owner: acc.id,
                                        email: field_email,
                                        topic: field_topic,
                                        content: field_content,
                                    },

                                    joins: {},
                                }],

                                config: {
                                    events: {
                                        failure: () => {
                                            dispatch(gv.report.act.push_error({
                                                text: t(`popups.error.contact_default`)
                                            }))
                                        },

                                        success: () => {
                                            field_email_set("")
                                            field_topic_set("")
                                            field_content_set("")

                                            dispatch(gv.report.act.push_info({
                                                text: t(`popups.info.contact_default`)
                                            }))
                                        },

                                        cleanup: () => {
                                            verify_strict_set(false)
                                            status_pending_set(false)
                                        },
                                    },
                                },
                            }))
                        } else {
                            verify_strict_set(true)
                        }
                    }}
                >
                    {t("commons.submit")}
                </EPCardImg_Headln_Btn>
            </div>
        </section>
    </main>
}

export default EFContact_Page
