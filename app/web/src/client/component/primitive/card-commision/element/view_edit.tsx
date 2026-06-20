import st from "@client/component/primitive/card-commision/style/view.module.scss"
import * as gs from "@fst/gstate"
import { gv, rem } from "@fst/gstate"
import * as asr from "@qyu/atom-state-react"
import EPAction_BtnToggle from "@src/client/component/primitive/action/element/btn_toggle"
import { useEPCardCommisionPrice } from "@src/client/component/primitive/card-commision/hook/price"
import { epcardcommision__format_identity } from "@src/client/component/primitive/card-commision/util/format/identity"
import { epcardcommision__format_phone } from "@src/client/component/primitive/card-commision/util/format/phone"
import EPCardImg_Headln_Btn from "@src/client/component/primitive/card-img/element/headln__btn"
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

export type EPCardCommision__ViewEdit_Props = {
    readonly node: gs.Rem_JoinData<"commision">
}

export const EPCardCommision_ViewEdit: r.FC<EPCardCommision__ViewEdit_Props> = props => {
    const { t } = ri18.useTranslation()
    const dispatch = asr.useAtomDispatch()
    const init_time = r.useMemo(() => Date.now(), [])
    const cache_price = r.useMemo(() => new WeakMap<{}, number>(), [])

    const price_total = useEPCardCommisionPrice({
        cache_price,
        cart: props.node.refnodes.map(n => n.node) ?? null,
    })

    const [status_pending, status_pending_set] = r.useState(false)

    const [field_status_paid, field_status_paid_set] = r.useState(Number(props.node.paynment_amount > 0))
    const [field_status_delivered, field_status_delivered_set] = r.useState(props.node.status_delivered)

    const status_haschange = (
        field_status_paid !== Number(props.node.paynment_amount > 0)
        || field_status_delivered !== props.node.status_delivered
    )

    return <div className={st.root}>
        <div className={st.line_date}>
            <span className={st.date}>
                {time_format_ago(init_time - props.node.creation_date, t)}
            </span>
        </div>

        <div className={cl(st.head, st._edit)}>
            <div className={st.head__left}>
                <h2 className={st.head__title}>
                    {epcardcommision__format_identity(props.node.id_public)}
                </h2>

                <span className={st.head__status}>
                    {price_total.toString()} {t("currency.uah")}
                </span>
            </div>

            <div className={st.head__right}>
                <div className={st.head__statusline}>
                    <EPAction_BtnToggle
                        style_root
                        state_active={field_status_delivered === 1}

                        event_click={() => {
                            field_status_delivered_set(n => Number(!n) as 0 | 1)
                        }}
                    >
                        {t("commision.label_status_delivered")}
                    </EPAction_BtnToggle>

                    <EPAction_BtnToggle
                        style_root
                        state_active={field_status_paid === 1}

                        event_click={() => {
                            field_status_paid_set(n => Number(!n) as 0 | 1)
                        }}
                    >
                        {t("commision.label_status_paid")}
                    </EPAction_BtnToggle>
                </div>

                <div className={st.head__actline}>
                    <EPCardImg_Headln_Btn
                        icon={null}
                        state_disabled={!status_haschange || status_pending}

                        event_click={() => {
                            field_status_delivered_set(props.node.status_delivered)
                            field_status_paid_set(Number(props.node.paynment_amount > 0))
                        }}
                    >
                        {t("commons.discard")}
                    </EPCardImg_Headln_Btn>

                    <EPCardImg_Headln_Btn
                        icon={null}
                        state_pending={status_pending}
                        state_disabled={!status_haschange}

                        event_click={() => {
                            status_pending_set(true)

                            dispatch(rem.commision.act.patch({
                                body: {
                                    id: props.node.id,

                                    patch: {
                                        paynment_amount: field_status_paid,
                                        status_delivered: field_status_delivered,
                                    },
                                },

                                config: {
                                    events: {
                                        success: () => {
                                            dispatch(gv.report.act.push_info({
                                                text: t("popups.info.commision_patch_default")
                                            }))
                                        },

                                        failure: () => {
                                            dispatch(gv.report.act.push_error({
                                                text: t("popups.error.commision_patch_default")
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
                    placeholder={t("commons.placeholder_delivery_terminal_empty")}
                    text={props.node.delivery_division?.name_short}
                />
            </div>
        </div>
    </div>
}

export default EPCardCommision_ViewEdit
