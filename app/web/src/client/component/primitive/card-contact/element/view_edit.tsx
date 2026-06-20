import st from "@client/component/primitive/card-contact/style/view.module.scss"
import stheme_intext_form from "@client/component/primitive/in-text/style/white.module.scss"
import { gv, rem } from "@fst/gstate"
import * as asr from "@qyu/atom-state-react"
import EPAction_BtnToggle from "@src/client/component/primitive/action/element/btn_toggle"
import EPCardImg_Headln_Btn from "@src/client/component/primitive/card-img/element/headln__btn"
import { EPInText_BlockComment } from "@src/client/component/primitive/in-text/element/block_comment"
import EPInText_Input from "@src/client/component/primitive/in-text/element/input"
import EPInText_ViewWeak from "@src/client/component/primitive/in-text/element/view_weak"
import EPInTextArea_Area from "@src/client/component/primitive/in-textarea/element/area"
import { time_format_ago } from "@src/client/util/time/format/ago"
import * as r from "react"
import * as z from "zod"
import * as ri18 from "react-i18next"
import * as gs from "@fst/gstate"

const cst_topic_maxlength = 255
const cst_topic_minlength = 10
const cst_content_minlength = 10

const validate_email = function(value: string) {
    return z.email().safeParse(value).success
}

const validate_topic = function(value: string) {
    return value.length < cst_topic_maxlength && value.length > cst_topic_minlength
}

const validate_content = function(value: string) {
    return value.length > cst_content_minlength
}

export type EPCardContact__ViewEdit_Props = {
    readonly node: gs.Rem_JoinData<"contact_message">
}

export const EPCardContact_ViewEdit: r.FC<EPCardContact__ViewEdit_Props> = props => {
    const { t } = ri18.useTranslation()

    const dispatch = asr.useAtomDispatch()
    const init_time = r.useMemo(() => Date.now(), [])

    const [status_pending, status_pending_set] = r.useState(false)

    const email_id = r.useId()
    const [email_field, email_field_set] = r.useState(props.node.email)

    const topic_id = r.useId()
    const [topic_field, topic_field_set] = r.useState(props.node.topic)

    const content_id = r.useId()
    const [content_field, content_field_set] = r.useState(props.node.content)

    const [status_reviewed_field, status_reviewed_field_set] = r.useState(props.node.status_reviewed)

    const status_haschange = (
        status_reviewed_field !== props.node.status_reviewed
        || email_field !== props.node.email
        || topic_field !== props.node.topic
        || content_field !== props.node.content
    )

    return <div className={st.root}>
        <div className={st.head}>
            <div className={st.head__info}>
                <h2 className={st.head__title}>
                    {props.node.id}
                </h2>

                <span className={st.date}>
                    {time_format_ago(init_time - props.node.creation_date, t)}
                </span>
            </div>

            <div className={st.head__acts}>
                <EPAction_BtnToggle
                    style_root
                    icon={`eye_open`}
                    className={st.head__act}
                    state_active={status_reviewed_field === 1}

                    event_click={() => {
                        status_reviewed_field_set(n => Number(!n) as 0 | 1)
                    }}
                />

                <EPCardImg_Headln_Btn
                    icon={null}
                    style_anim_swiperight={false}
                    state_disabled={!status_haschange}

                    event_click={() => {
                        email_field_set(props.node.email)
                        topic_field_set(props.node.topic)
                        content_field_set(props.node.content)
                        status_reviewed_field_set(props.node.status_reviewed)
                    }}
                >
                    {t("commons.discard")}
                </EPCardImg_Headln_Btn>

                <EPCardImg_Headln_Btn
                    icon={null}
                    style_anim_swiperight={false}
                    state_pending={status_pending}

                    state_disabled={(
                        !status_haschange
                        || !validate_email(email_field)
                        || !validate_topic(topic_field)
                        || !validate_content(content_field)
                    )}

                    event_click={() => {
                        status_pending_set(true)

                        dispatch(rem.contact_message.act.patch({
                            body: {
                                id: props.node.id,

                                patch: {
                                    content: content_field,
                                    email: email_field,
                                    topic: topic_field,
                                    status_reviewed: status_reviewed_field,
                                },
                            },

                            config: {
                                events: {
                                    success: () => {
                                        dispatch(gv.report.act.push_info({
                                            text: t("popups.info.contact_patch_default")
                                        }))
                                    },

                                    failure: () => {
                                        dispatch(gv.report.act.push_error({
                                            text: t("popups.error.contact_patch_default")
                                        }))
                                    },

                                    cleanup: () => {
                                        status_pending_set(false)
                                    },
                                },
                            },
                        }))
                    }}
                >
                    {t("commons.save")}
                </EPCardImg_Headln_Btn>
            </div>
        </div>

        <div className={st.field}>
            <label className={st.label} htmlFor={email_id}>
                {t("commons.email")}
            </label>

            <EPInText_ViewWeak
                value={email_field}
                stmod={stheme_intext_form}

                value_validator={value => {
                    return validate_email(value)
                }}
            >
                <EPInText_Input
                    type="email"
                    id={email_id}
                    event_value_change={email_field_set}
                    placeholder={t(`commons.placeholder_email`)}
                />
            </EPInText_ViewWeak>
        </div>

        <div className={st.field}>
            <label className={st.label} htmlFor={topic_id}>
                {t("contact.label_topic")}
            </label>

            <EPInText_ViewWeak
                value={topic_field}
                stmod={stheme_intext_form}

                value_validator={value => {
                    return validate_topic(value)
                }}
            >
                <EPInText_Input
                    type="topic"
                    id={topic_id}
                    event_value_change={topic_field_set}
                    placeholder={t("contact.placeholder_topic")}
                />

                <EPInText_BlockComment>
                    {`${topic_field.length} / ${cst_topic_maxlength.toString()}`}
                </EPInText_BlockComment>
            </EPInText_ViewWeak>
        </div>

        <div className={st.field}>
            <label className={st.label} htmlFor={content_id}>
                {t(`contact.label_content`)}
            </label>

            <EPInTextArea_Area
                rows={20}
                id={content_id}
                stmod={stheme_intext_form}
                value_default={content_field}
                event_value_change={content_field_set}
                placeholder={t(`contact.placeholder_content`)}

                value_validator={value => {
                    return validate_content(value)
                }}
            />
        </div>
    </div>
}

export default EPCardContact_ViewEdit
