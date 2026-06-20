import st from "@client/component/primitive/card-commision/style/view.module.scss"
import * as gs from "@fst/gstate"
import { useEPCardCommisionPrice } from "@src/client/component/primitive/card-commision/hook/price"
import { epcardcommision__format_identity } from "@src/client/component/primitive/card-commision/util/format/identity"
import { epcardcommision__format_phone } from "@src/client/component/primitive/card-commision/util/format/phone"
import EPIcon_FA from "@src/client/component/primitive/icon/element/view"
import { urlmap } from "@src/client/urlmap"
import { time_format_ago } from "@src/client/util/time/format/ago"
import cl from "classnames"
import * as r from "react"
import * as ri18 from "react-i18next"
import * as rr from "react-router"

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

export type EPCardCommision__ViewRead_Props = {
    readonly node: gs.Rem_JoinData<"commision">
}

export const EPCardCommision_ViewRead: r.FC<EPCardCommision__ViewRead_Props> = props => {
    const { t } = ri18.useTranslation()

    const init_time = r.useMemo(() => Date.now(), [])
    const cache_price = r.useMemo(() => new WeakMap<{}, number>(), [])

    const price_total = useEPCardCommisionPrice({
        cache_price,
        cart: props.node.refnodes.map(n => n.node) ?? null,
    })

    return <div className={st.root}>
        <div className={st.line_date}>
            <span className={st.date}>
                {time_format_ago(init_time - props.node.creation_date, t)}
            </span>

            <div className={st.head__statusline}>
                <span className={st.head__status}>
                    {props.node.paynment_amount ? t("commision.label_status_paid") : t("commision.label_status_not_paid")}
                </span>

                <span className={st.head__status}>
                    {props.node.status_delivered ? t("commision.label_status_delivered") : t("commision.label_status_not_delivered")}
                </span>
            </div>
        </div>

        <div className={st.head}>
            <div className={st.head__left}>
                <h2 className={st.head__title}>
                    {epcardcommision__format_identity(props.node.id_public)}
                </h2>

                <span className={st.head__status}>
                    {price_total.toString()} {t("currency.uah")}
                </span>
            </div>

            <div className={st.head__right}>

                <div className={st.head__actline}>
                    <rr.Link
                        className={st.head__link}
                        to={`${urlmap.shared.commision_view({ id: props.node.id })}?id_public=${encodeURIComponent(props.node.id_public)}`}
                    >
                        <EPIcon_FA def={`arrow-right`} />
                    </rr.Link>
                </div>
            </div>
        </div>

        <div className={st.field}>
            <label className={st.label}>
                {t("commons.email")}
            </label>

            <EL_Input
                text={props.node.contact_email}
                placeholder={t("commons.placeholder_email_empty")}
            />
        </div>

        <div className={st.field}>
            <label className={st.label}>
                {t("commons.phone")}
            </label>

            <EL_Input
                text={epcardcommision__format_phone(props.node.contact_phone)}
                placeholder={t("commons.placeholder_phone_empty")}
            />
        </div>

        <div className={st.line_names}>
            <div className={st.field}>
                <label className={st.label} >
                    {t("commons.familyname")}
                </label>

                <EL_Input
                    style_nowrap
                    text={props.node.contact_lname}
                    placeholder={t("commons.placeholder_familyname_empty")}
                />
            </div>

            <div className={st.field}>
                <label className={st.label} >
                    {t("commons.firstname")}
                </label>


                <EL_Input
                    style_nowrap
                    text={props.node.contact_fname}
                    placeholder={t("commons.placeholder_firstname_empty")}
                />
            </div>

            <div className={st.field}>
                <label className={st.label} >
                    {t("commons.patronym")}
                </label>


                <EL_Input
                    style_nowrap
                    text={props.node.contact_pname}
                    placeholder={t("commons.placeholder_patronym_empty")}
                />
            </div>
        </div>

        <div className={st.line_delivery}>
            <div className={st.field}>
                <label className={st.label} >
                    {t("commons.oblast")}
                </label>

                <EL_Input
                    style_nowrap
                    text={props.node.delivery_division?.parent_name}
                    placeholder={t("commons.placeholder_oblast_empty")}
                />
            </div>

            <div className={st.field}>
                <label className={st.label} >
                    {t("commons.city")}
                </label>

                <EL_Input
                    style_nowrap
                    text={props.node.delivery_division?.city_name}
                    placeholder={t("commons.placeholder_city_empty")}
                />
            </div>

            <div className={st.field}>
                <label className={st.label} >
                    {t("commons.delivery_terminal")}
                </label>

                <EL_Input
                    style_nowrap
                    text={props.node.delivery_division?.name_short}
                    placeholder={t("commons.placeholder_delivery_terminal_empty")}
                />
            </div>
        </div>
    </div>
}

export default EPCardCommision_ViewRead
