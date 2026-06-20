import st from "@src/client/component/feature/console-commisions/style/head.module.scss"
import EPIcon_FA from "@src/client/component/primitive/icon/element/view"
import EPInText_Input from "@src/client/component/primitive/in-text/element/input"
import EPInText_ViewWeak from "@src/client/component/primitive/in-text/element/view_weak"
import st_intext from "@src/client/component/primitive/in-text/style/white.module.scss"
import type { FnSetterStateful } from "@src/client/type/fns"
import cl from "classnames"
import * as r from "react"
import * as ri18 from "react-i18next"

export type ELConCommisions__Head_Props = {
    readonly field_id_public: string
    readonly field_id_public_set: FnSetterStateful<string>

    readonly field_email: string
    readonly field_email_set: FnSetterStateful<string>

    readonly field_phone: string
    readonly field_phone_set: FnSetterStateful<string>

    readonly field_city: string
    readonly field_city_set: FnSetterStateful<string>

    readonly field_region: string
    readonly field_region_set: FnSetterStateful<string>

    readonly field_division: string
    readonly field_division_set: FnSetterStateful<string>

    readonly field_name_first: string
    readonly field_name_first_set: FnSetterStateful<string>

    readonly field_name_family: string
    readonly field_name_family_set: FnSetterStateful<string>

    readonly field_name_father: string
    readonly field_name_father_set: FnSetterStateful<string>

    readonly field_status_paid: 0 | 1
    readonly field_status_paid_set: FnSetterStateful<0 | 1>

    readonly field_status_delivered: 0 | 1
    readonly field_status_delivered_set: FnSetterStateful<0 | 1>
}

export const ELConCommisions_Head: r.FC<ELConCommisions__Head_Props> = props => {
    const { t } = ri18.useTranslation()

    const id_id_public = r.useId()
    const id_email = r.useId()
    const id_phone = r.useId()
    const id_city = r.useId()
    const id_region = r.useId()
    const id_division = r.useId()
    const id_name_first = r.useId()
    const id_name_family = r.useId()
    const id_name_father = r.useId()
    const id_status_paid = r.useId()
    const id_status_delivered = r.useId()

    return <div className={st.root}>
        <div className={st.line_id}>
            <div className={st.field}>
                <label className={st.label} htmlFor={id_id_public}>
                    {t(`commision.label_identifier`)}
                </label>

                <EPInText_ViewWeak
                    value_nosync
                    stmod={st_intext}
                    value={props.field_id_public}
                >
                    <EPInText_Input
                        id={id_id_public}
                        mask={"0000-0000-0000-0000"}
                        placeholder={"0000-0000-0000-0000"}

                        event_value_change={v => {
                            props.field_id_public_set(v.replace(/\D+/g, ""))
                        }}
                    />
                </EPInText_ViewWeak>
            </div>

            <div className={cl(st.field, st._inline)}>
                <label className={cl(st.label, st._big)} htmlFor={id_status_delivered}>
                    {t(`commision.label_status_delivered`)}
                </label>

                <button
                    role={`radio`}
                    id={id_status_delivered}
                    className={cl(st.radio, Boolean(props.field_status_delivered) && st._checked)}

                    onClick={() => {
                        props.field_status_delivered_set(n => Number(!n) as 0 | 1)
                    }}
                >
                    <EPIcon_FA def={`check`} />
                </button>
            </div>

            <div className={cl(st.field, st._inline)}>
                <label className={cl(st.label, st._big)} htmlFor={id_status_paid}>
                    {t(`commision.label_status_paid`)}
                </label>

                <button
                    role={`radio`}
                    id={id_status_paid}
                    className={cl(st.radio, Boolean(props.field_status_paid) && st._checked)}

                    onClick={() => {
                        props.field_status_paid_set(n => Number(!n) as 0 | 1)
                    }}
                >
                    <EPIcon_FA def={`check`} />
                </button>
            </div>
        </div>

        <div className={st.line_email}>
            <div className={st.field}>
                <label className={st.label} htmlFor={id_email}>
                    {t("commons.email")}
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

            <div className={st.field}>
                <label className={st.label} htmlFor={id_phone}>
                    {t("commons.phone")}
                </label>

                <EPInText_ViewWeak
                    value_nosync
                    stmod={st_intext}
                    value={props.field_phone}
                >
                    <EPInText_Input
                        id={id_phone}
                        mask={"(000) 000 00 00"}
                        placeholder={t("commons.placeholder_phone_ua")}

                        event_value_change={v => {
                            props.field_phone_set(v.replace(/\D+/g, ""))
                        }}
                    />
                </EPInText_ViewWeak>
            </div>
        </div>

        <div className={st.line_names}>
            <div className={st.field}>
                <label className={st.label} htmlFor={id_name_family}>
                    {t("commons.familyname")}
                </label>

                <EPInText_ViewWeak
                    stmod={st_intext}
                    value={props.field_name_family}
                >
                    <EPInText_Input
                        id={id_name_family}
                        placeholder={t("commons.placeholder_familyname")}
                        event_value_change={props.field_name_family_set}
                    />
                </EPInText_ViewWeak>
            </div>

            <div className={st.field}>
                <label className={st.label} htmlFor={id_name_first}>
                    {t("commons.firstname")}
                </label>

                <EPInText_ViewWeak
                    stmod={st_intext}
                    value={props.field_name_first}
                >
                    <EPInText_Input
                        id={id_name_first}
                        placeholder={t("commons.placeholder_firstname")}
                        event_value_change={props.field_name_first_set}
                    />
                </EPInText_ViewWeak>
            </div>

            <div className={st.field}>
                <label className={st.label} htmlFor={id_name_father}>
                    {t("commons.patronym")}
                </label>

                <EPInText_ViewWeak
                    stmod={st_intext}
                    value={props.field_name_father}
                >
                    <EPInText_Input
                        id={id_name_father}
                        placeholder={t("commons.placeholder_patronym")}
                        event_value_change={props.field_name_father_set}
                    />
                </EPInText_ViewWeak>
            </div>
        </div>

        <div className={st.line_delivery}>
            <div className={st.field}>
                <label className={st.label} htmlFor={id_region}>
                    {t("commons.oblast")}
                </label>

                <EPInText_ViewWeak
                    stmod={st_intext}
                    value={props.field_region}
                >
                    <EPInText_Input
                        id={id_region}
                        event_value_change={props.field_region_set}
                        placeholder={t("commons.placeholder_oblast")}
                    />
                </EPInText_ViewWeak>
            </div>

            <div className={st.field}>
                <label className={st.label} htmlFor={id_city}>
                    {t("commons.city")}
                </label>

                <EPInText_ViewWeak
                    stmod={st_intext}
                    value={props.field_city}
                >
                    <EPInText_Input
                        id={id_city}
                        placeholder={t("commons.placeholder_city")}
                        event_value_change={props.field_city_set}
                    />
                </EPInText_ViewWeak>
            </div>

            <div className={st.field}>
                <label className={st.label} htmlFor={id_division}>
                    {t("commons.delivery_terminal")}
                </label>

                <EPInText_ViewWeak
                    stmod={st_intext}
                    value={props.field_division}
                >
                    <EPInText_Input
                        id={id_division}
                        event_value_change={props.field_division_set}
                        placeholder={t("commons.placeholder_delivery_terminal")}
                    />
                </EPInText_ViewWeak>
            </div>
        </div>
    </div>
}
