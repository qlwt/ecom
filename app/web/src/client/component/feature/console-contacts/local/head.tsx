import st from "@src/client/component/feature/console-contacts/style/head.module.scss"
import EPIcon_FA from "@src/client/component/primitive/icon/element/view"
import EPInText_Input from "@src/client/component/primitive/in-text/element/input"
import EPInText_ViewWeak from "@src/client/component/primitive/in-text/element/view_weak"
import st_intext from "@src/client/component/primitive/in-text/style/white.module.scss"
import type { FnSetterStateful } from "@src/client/type/fns"
import cl from "classnames"
import * as r from "react"
import * as ri18 from "react-i18next"

export type ELConContacts__Head_Props = {
    readonly field_status_reviewed: 0 | 1
    readonly field_status_reviewed_set: FnSetterStateful<0 | 1>

    readonly field_email: string
    readonly field_email_set: FnSetterStateful<string>

    readonly field_topic: string
    readonly field_topic_set: FnSetterStateful<string>

    readonly field_content: string
    readonly field_content_set: FnSetterStateful<string>
}

export const ELConContacts_Head: r.FC<ELConContacts__Head_Props> = props => {
    const { t } = ri18.useTranslation()

    const id_email = r.useId()
    const id_topic = r.useId()
    const id_content = r.useId()
    const id_status_reviewed = r.useId()

    return <div className={st.root}>
        <div className={st.line_email}>
            <div className={st.field}>
                <label className={st.label} htmlFor={id_email}>
                    {t(`commons.email`)}
                </label>

                <EPInText_ViewWeak
                    stmod={st_intext}
                    value={props.field_email}
                >
                    <EPInText_Input
                        id={id_email}
                        event_value_change={props.field_email_set}
                        placeholder={t("commons.placeholder_email")}
                    />
                </EPInText_ViewWeak>
            </div>

            <div className={cl(st.field, st._inline)}>
                <label className={cl(st.label, st._big)} htmlFor={id_status_reviewed}>
                    {t("contact.label_status_reviewed")}
                </label>

                <button
                    role={`radio`}
                    id={id_status_reviewed}
                    className={cl(st.radio, Boolean(props.field_status_reviewed) && st._checked)}

                    onClick={() => {
                        props.field_status_reviewed_set(n => Number(!n) as 0 | 1)
                    }}
                >
                    <EPIcon_FA def={`check`} />
                </button>
            </div>
        </div>

        <div className={st.field}>
            <label className={st.label} htmlFor={id_topic}>
                {t("contact.label_topic")}
            </label>

            <EPInText_ViewWeak
                stmod={st_intext}
                value={props.field_topic}
            >
                <EPInText_Input
                    id={id_topic}
                    placeholder={t("contact.placeholder_topic")}
                    event_value_change={props.field_topic_set}
                />
            </EPInText_ViewWeak>
        </div>

        <div className={st.field}>
            <label className={st.label} htmlFor={id_content}>
                {t("contact.label_content")}
            </label>

            <EPInText_ViewWeak
                stmod={st_intext}
                value={props.field_content}
            >
                <EPInText_Input
                    id={id_content}
                    event_value_change={props.field_content_set}
                    placeholder={t("contact.placeholder_content")}
                />
            </EPInText_ViewWeak>
        </div>
    </div>
}
