import st from "@client/component/primitive/card-contact/style/view.module.scss"
import * as gs from "@fst/gstate"
import { time_format_ago } from "@src/client/util/time/format/ago"
import cl from "classnames"
import * as r from "react"
import * as ri18 from "react-i18next"

type EL__Input_Props = {
    readonly text?: string
    readonly placeholder: string

    readonly style_nowrap?: boolean
}

const EL_Input: r.FC<EL__Input_Props> = props => {
    const text_clean = props.text?.trim()

    return <div
        className={cl(
            st.input,
            !text_clean && st._empty,
            props.style_nowrap && st._nowrap,
        )}
    >
        {text_clean || props.placeholder}
    </div>
}

export type EPCardContact__ViewRead_Props = {
    readonly node: gs.Rem_JoinData<"contact_message">
}

export const EPCardContact_ViewRead: r.FC<EPCardContact__ViewRead_Props> = props => {
    const { t } = ri18.useTranslation()
    const init_time = r.useMemo(() => Date.now(), [])

    return <div className={st.root}>
        <div className={st.head}>
            <span className={st.date}>
                {time_format_ago(init_time - props.node.creation_date, t)}
            </span>

            <span className={st.status}>
                {props.node.status_reviewed ? t("contact.label_status_reviewed") : t("contact.label_status_not_reviewed")}
            </span>
        </div>

        <div className={st.field}>
            <label className={st.label}>
                {t("commons.email")}
            </label>

            <EL_Input
                text={props.node.email}
                placeholder={t("commons.placeholder_email_empty")}
            />
        </div>

        <div className={st.field}>
            <label className={st.label}>
                {t("contact.label_topic")}
            </label>

            <EL_Input
                text={props.node.topic}
                placeholder={t("contact.placeholder_topic_empty")}
            />
        </div>

        <div className={st.field}>
            <label className={st.label} >
                {t("contact.label_content")}
            </label>

            <EL_Input
                text={props.node.content}
                placeholder={t("contact.placeholder_content_empty")}
            />
        </div>
    </div>
}

export default EPCardContact_ViewRead
