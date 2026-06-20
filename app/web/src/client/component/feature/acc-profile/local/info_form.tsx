import st from "@client/component/feature/acc-profile/style/info_form.module.scss"
import * as cc from "@fst/config/client"
import { gv, rem, remx } from "@fst/gstate"
import * as asc from "@qyu/atom-state-core"
import * as asr from "@qyu/atom-state-react"
import * as sc from "@qyu/signal-core"
import EPCardImg_Headln_Btn from "@src/client/component/primitive/card-img/element/headln__btn"
import EPInOption_View from "@src/client/component/primitive/in-option/element/view"
import stheme_inoption_form from "@src/client/component/primitive/in-option/style/theme_form.module.scss"
import EPInText_Input from "@src/client/component/primitive/in-text/element/input"
import EPInText_ViewWeak from "@src/client/component/primitive/in-text/element/view_weak"
import stheme_intext from "@src/client/component/primitive/in-text/style/white.module.scss"
import { useRemData } from "@src/client/hook/asc/remdata"
import { useAtomChildFallback } from "@src/client/util/asr/atomchild_fallback"
import { useAtomLoaderFallback } from "@src/client/util/asr/atomloader_fallback"
import { useAtomWrapFallback } from "@src/client/util/asr/atomwrap_fallback"
import { useSignalOutputFallback } from "@src/client/util/sr/signaloutput_fallback"
import * as r from "react"
import * as ri18 from "react-i18next"
import * as z from "zod"

const validate_email = function(value: string) {
    if (value === "") {
        return true
    }

    return z.email().safeParse(value).success
}

const validate_phone = function(value: string) {
    const value_parsed = value.replace(/\D+/g, "")

    return value_parsed.length === 0 || value_parsed.length >= 10
}

export type ELAccProfile__InfoForm_Props = {
    readonly acc: cc.RemDef["acc"]["joins"]["core"]
}

export const ELAccProfile_InfoForm: r.FC<ELAccProfile__InfoForm_Props> = props => {
    const { t } = ri18.useTranslation()

    const store = asr.useAtomStore()
    const dispatch = asr.useAtomDispatch()

    const [status_pending, status_pending_set] = r.useState(false)

    const id_email = r.useId()
    const [field_email, field_email_set] = r.useState(props.acc.contact_email)

    const id_phone = r.useId()
    const [field_phone, field_phone_set] = r.useState(props.acc.contact_phone)

    const id_name_first = r.useId()
    const [field_name_first, field_name_first_set] = r.useState(props.acc.contact_fname)

    const id_name_family = r.useId()
    const [field_name_family, field_name_family_set] = r.useState(props.acc.contact_lname)

    const id_name_father = r.useId()
    const [field_name_father, field_name_father_set] = r.useState(props.acc.contact_pname)

    const [city_sel, city_sel_set] = r.useState<number | null>(null)
    const [parent_sel, parent_sel_set] = r.useState<number | null>(null)
    const [division_sel, division_sel_set] = r.useState<string | null>(props.acc.delivery_division__id)

    const division_view = useSignalOutputFallback(r.useMemo(() => {
        if (typeof division_sel === "string") {
            return sc.osignal_new_pipe(
                store.reg(rem.delivery_division.joins.core())({
                    id: division_sel,
                }),
                join => join?.data ?? null
            )
        }

        return null
    }, [division_sel]), null)

    const city_view_sel = useRemData(
        useAtomChildFallback({
            family: remx.delivery_city.register,

            param: r.useMemo(() => {
                return typeof city_sel === "number" ? {
                    numid: city_sel
                } : null
            }, [city_sel]),
        })
    )

    const parent_view_sel = useRemData(useAtomChildFallback({
        family: remx.delivery_parent.register,

        param: r.useMemo(() => {
            if (typeof parent_sel === "number") {
                return {
                    numid: parent_sel
                }
            }

            if (typeof city_view_sel?.parent__numid === "number") {
                return {
                    numid: city_view_sel?.parent__numid
                }
            }

            return null
        }, [parent_sel, city_view_sel]),
    }))

    const parent_view_infer = r.useMemo(() => {
        if (division_view) {
            return {
                name: division_view.parent_name,
                numid: division_view.parent_numid,
                country__code: division_view.country_code,
            } satisfies remx.RemXDelivery_ParentNodeDef["data"]
        }

        return null
    }, [division_view])

    const parent_view = parent_view_sel ?? parent_view_infer

    const city_view_infer = r.useMemo(() => {
        if (division_view) {
            return {
                name: division_view.city_name,
                numid: division_view.city_numid,
                parent__numid: division_view.city_numid
            } satisfies remx.RemXDelivery_CityNodeDef["data"]
        }

        return null
    }, [division_view])

    const city_view = city_view_sel ?? city_view_infer

    const parents = asr.useAtomOutput(r.useCallback(({ reg }) => {
        return sc.osignal_new_pipeflat(
            sc.osignal_new_listpipe(
                reg(remx.delivery_parent.indexer_new(["country__code"])).reg({
                    country__code: "UA",
                }),
                remnode => {
                    return sc.osignal_new_memo(
                        sc.osignal_new_pipe(
                            reg(asc.atomremnode_data({ remnode: () => remnode, })),
                            remview => remview.data,
                        ),
                        null
                    )
                },
            ),
            nodes_s => sc.osignal_new_pipe(
                sc.osignal_new_merge(nodes_s),
                nodes => nodes.filter(node => node !== null)
            )
        )
    }, []))

    const cities = asr.useAtomOutput(r.useCallback(({ reg }) => {
        return sc.osignal_new_pipeflat(
            sc.osignal_new_listpipe(
                reg(remx.delivery_city.indexer_new(["parent__numid"])).reg({
                    parent__numid: parent_view?.numid ?? -1
                }),
                remnode => {
                    return sc.osignal_new_memo(
                        sc.osignal_new_pipe(
                            reg(asc.atomremnode_data({ remnode: () => remnode, })),
                            remview => remview.data,
                        ),
                        null
                    )
                },
            ),
            nodes_s => sc.osignal_new_pipe(
                sc.osignal_new_merge(nodes_s),
                nodes => nodes.filter(node => node !== null)
            )
        )
    }, [parent_view?.numid]))

    const terminals = asr.useAtomOutput(r.useCallback(({ reg }) => {
        return sc.osignal_new_pipe(
            sc.osignal_new_pipeflat(
                sc.osignal_new_listpipe(
                    reg(rem.delivery_division.indexer_new(["city_numid"])).reg({
                        city_numid: city_view?.numid ?? -1
                    }),
                    node => {
                        return sc.osignal_new_memo(
                            sc.osignal_new_pipe(
                                reg(rem.delivery_division.joins.core())({
                                    id: node.statics.id,
                                }),
                                n => n?.data ?? null
                            ),
                            null
                        )
                    },
                ),
                nodes => sc.osignal_new_merge(nodes)
            ),
            nodes => nodes.filter(n => n !== null)
        )
    }, [city_view]))

    useAtomLoaderFallback(useAtomWrapFallback(useAtomChildFallback({
        family: remx.delivery_parent.loaders.get_bycountry,

        param: {
            country__code: "UA",
        },
    } as const)))

    useAtomLoaderFallback(useAtomWrapFallback(useAtomChildFallback({
        family: remx.delivery_city.loaders.get_byparent,

        param: r.useMemo(() => typeof parent_view?.numid === "number" ? {
            parent__numid: parent_view?.numid,
        } : null, [parent_view?.numid]),
    } as const)))

    useAtomLoaderFallback(useAtomWrapFallback(useAtomChildFallback({
        family: rem.delivery_division.loaders.get,

        param: r.useMemo(() => typeof city_view?.numid === "number" ? {
            pick_parents: null,
            pick_cities: [city_view?.numid],

            pick_owner: ["null-public"],
            include_hidden: 0 as const,
        } : null, [city_view?.numid]),
    } as const)))

    useAtomLoaderFallback(useAtomWrapFallback(useAtomChildFallback({
        family: rem.delivery_division.loaders.get_id,

        param: r.useMemo(() => {
            if (typeof props.acc.delivery_division__id === "string") {
                return {
                    id: props.acc.delivery_division__id,
                    pick_cities: null,
                    pick_parents: null,

                    pick_owner: ["null-public"],
                    include_hidden: 0 as const,
                }
            }

            return null
        }, [props.acc.delivery_division__id])
    })))

    return <div className={st.root}>
        <div className={st.head}>
            <h2 className={st.head__title}>
                {t(`commons.contact_info`)}
            </h2>

            <EPCardImg_Headln_Btn
                icon={null}
                state_pending={status_pending}

                state_disabled={
                    !validate_email(field_email)
                    || !validate_phone(field_phone)
                }

                event_click={() => {
                    status_pending_set(true)

                    dispatch(rem.acc.act.patch({
                        body: {
                            id: props.acc.id,

                            patch: {
                                contact_email: field_email,
                                contact_phone: field_phone,
                                contact_fname: field_name_first,
                                contact_lname: field_name_family,
                                contact_pname: field_name_father,
                                delivery_division__id: division_sel,
                            }
                        },

                        config: {
                            events: {
                                success: () => {
                                    dispatch(gv.report.act.push_info({
                                        text: t(`popups.info.contact_info_default`),
                                    }))
                                },

                                failure: () => {
                                    dispatch(gv.report.act.push_error({
                                        text: t(`popups.error.contact_info_default`),
                                    }))
                                },

                                cleanup: () => {
                                    status_pending_set(false)
                                },
                            },
                        },
                    },
                    ))
                }}
            >
                {t("commons.save")}
            </EPCardImg_Headln_Btn>
        </div>

        <div className={st.field}>
            <label className={st.label} htmlFor={id_email}>
                {t(`commons.email`)}
            </label>

            <EPInText_ViewWeak
                value={field_email}
                stmod={stheme_intext}
                state_disabled={status_pending}

                value_validator={v => {
                    return validate_email(v)
                }}
            >
                <EPInText_Input
                    id={id_email}
                    type={`text`}
                    event_value_change={field_email_set}
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

                value={field_phone}
                stmod={stheme_intext}
                state_disabled={status_pending}

                value_validator={v => {
                    return validate_phone(v)
                }}
            >
                <EPInText_Input
                    id={id_phone}
                    type={`text`}
                    mask={`(000) 000 00 00`}
                    placeholder={t("commons.placeholder_phone_ua")}
                    event_value_change={v => field_phone_set(v.replace(/\D+/g, ""))}
                />
            </EPInText_ViewWeak>
        </div>

        <div className={st.line_names}>
            <div className={st.field}>
                <label className={st.label} htmlFor={id_name_family}>
                    {t("commons.familyname")}
                </label>

                <EPInText_ViewWeak
                    value={field_name_family}
                    stmod={stheme_intext}
                    state_disabled={status_pending}
                >
                    <EPInText_Input
                        id={id_name_family}
                        type={`text`}
                        placeholder={t("commons.placeholder_familyname")}
                        event_value_change={v => field_name_family_set(v)}
                    />
                </EPInText_ViewWeak>
            </div>

            <div className={st.field}>
                <label className={st.label} htmlFor={id_name_first}>
                    {t("commons.firstname")}
                </label>

                <EPInText_ViewWeak
                    value={field_name_first}
                    stmod={stheme_intext}
                    state_disabled={status_pending}
                >
                    <EPInText_Input
                        id={id_name_first}
                        type={`text`}
                        placeholder={t("commons.placeholder_firstname")}
                        event_value_change={v => field_name_first_set(v)}
                    />
                </EPInText_ViewWeak>
            </div>

            <div className={st.field}>
                <label className={st.label} htmlFor={id_name_father}>
                    {t("commons.patronym")}
                </label>

                <EPInText_ViewWeak
                    value={field_name_father}
                    stmod={stheme_intext}
                    state_disabled={status_pending}
                >
                    <EPInText_Input
                        id={id_name_father}
                        type={`text`}
                        placeholder={t("commons.placeholder_patronym")}
                        event_value_change={v => field_name_father_set(v)}
                    />
                </EPInText_ViewWeak>
            </div>
        </div>

        <div className={st.field}>
            <label className={st.label}>
                {t("commons.delivery_address")}
            </label>

            <div className={st.line_divisions}>
                <div className={st.field}>
                    <EPInOption_View
                        kind_search={true}
                        theme={stheme_inoption_form}
                        placeholder={t("commons.placeholder_oblast_select")}
                        status_disabled={parents.length === 0 || status_pending}

                        option_list={parents}
                        option_name_new={parent => parent.name}
                        option_key_new={parent => parent.numid}
                        option_selection={parent_view ? [parent_view] : null}

                        option_selection_set={node => {
                            city_sel_set(null)
                            division_sel_set(null)
                            parent_sel_set(node.numid)
                        }}
                    />
                </div>

                <div className={st.field}>
                    <EPInOption_View
                        kind_search={true}
                        theme={stheme_inoption_form}
                        placeholder={t("commons.placeholder_city_select")}
                        status_disabled={parents.length === 0 || status_pending}

                        option_list={cities}
                        option_name_new={city => city.name}
                        option_key_new={city => city.numid}
                        option_selection={city_view ? [city_view] : null}

                        option_selection_set={node => {
                            division_sel_set(null)
                            city_sel_set(node.numid)
                        }}
                    />
                </div>

                <div className={st.field}>
                    <EPInOption_View
                        kind_search={true}
                        theme={stheme_inoption_form}
                        status_disabled={parents.length === 0 || status_pending}
                        placeholder={t("commons.placeholder_delivery_terminal_select")}

                        option_list={terminals}
                        option_key_new={terminal => terminal.numid}
                        option_name_new={terminal => terminal.name_short}
                        option_selection={division_view ? [division_view] : null}

                        option_selection_set={node => {
                            division_sel_set(node.id)
                        }}
                    />
                </div>
            </div>
        </div>
    </div>
}

export default ELAccProfile_InfoForm
