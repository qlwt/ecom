import st from "@client/component/feature/commision/style/page.module.scss"
import * as cc from "@fst/config/client"
import * as cst from "@fst/cst"
import { gv, rem, remx } from "@fst/gstate"
import * as asc from "@qyu/atom-state-core"
import * as asr from "@qyu/atom-state-react"
import * as rfl from "@qyu/reactcmp-flow-control"
import * as sc from "@qyu/signal-core"
import { useEFCommisionPrice } from "@src/client/component/feature/commision/hook/price"
import ELCommision_CardCartItem from "@src/client/component/feature/commision/local/card_cartitem"
import ELCommision_FormField from "@src/client/component/feature/commision/local/form_line"
import { efcommision__node_unavailable } from "@src/client/component/feature/commision/util/node_unavailable"
import EFStatusPage_NotFound from "@src/client/component/feature/status-page/element/page_notfound"
import EFStatusPage_Pending from "@src/client/component/feature/status-page/element/page_pending"
import EPCardImg_Headln_Btn from "@src/client/component/primitive/card-img/element/headln__btn"
import EPInOption_View from "@src/client/component/primitive/in-option/element/view"
import stheme_inoption_form from "@src/client/component/primitive/in-option/style/theme_form.module.scss"
import EPInText_Input from "@src/client/component/primitive/in-text/element/input"
import EPInText_ViewWeak from "@src/client/component/primitive/in-text/element/view_weak"
import st_intext from "@src/client/component/primitive/in-text/style/white.module.scss"
import { useRemData } from "@src/client/hook/asc/remdata"
import { useAuthAcc } from "@src/client/hook/auth/acc"
import { urlmap } from "@src/client/urlmap"
import { useAtomChildFallback } from "@src/client/util/asr/atomchild_fallback"
import { useAtomLoaderFallback } from "@src/client/util/asr/atomloader_fallback"
import { useAtomWrapFallback } from "@src/client/util/asr/atomwrap_fallback"
import { remclone_commision_node } from "@src/client/util/remclone/commision_node"
import cl from "classnames"
import * as r from "react"
import * as ri18 from "react-i18next"
import * as rr from "react-router"
import { v7 as uuid } from "uuid"
import * as z from "zod"

type UseLoad_Params = {
    readonly id: string
    readonly acc_id: string | null
    readonly id_public: string | null
}

const useLoad = function(params: UseLoad_Params) {
    const loader = asr.useAtomChild({
        atomfamily: rem.commision.loaders.get_id,

        params: r.useMemo(() => ({
            id: params.id,
            id_public: params.id_public,
            pick_owner: params.acc_id ? ["null-public", params.acc_id] : ["null-public"],

            search: null,
            include_hidden: null,
        }), [params.id, params.id_public, params.acc_id])
    })

    r.useEffect(() => {
        const cleanup = loader.request()

        return () => {
            cleanup()
        }
    }, [loader])
}

type UseCommision_Meta = {
    readonly status_pending: boolean
    readonly status_loadgrace: boolean
}

type UseCommision_Params = {
    readonly id: string
    readonly id_public: string | null
}

const useCommision = function(params: UseCommision_Params): [cc.RemDef["commision"]["joins"]["core"] | null, UseCommision_Meta] {
    const [status_loadgrace, status_loadgrace_set] = r.useState(true)

    const acc = useAuthAcc()

    const commision_status_pending = asr.useAtomOutput(r.useCallback(
        ({ reg }) => sc.osignal_new_pipe(
            reg(rem.commision.register).reg({ id: params.id }).real,
            real => real.status === asc.ReqState__Status.Pending
        ),
        [params.id]
    ), Object.is)

    const commision_join = asr.useAtomOutput(r.useCallback(
        ({ reg }) => reg(rem.commision.joins.core())({ id: params.id }),
        [params.id]
    ))

    useLoad({
        id: params.id,
        acc_id: acc?.id ?? null,
        id_public: params.id_public,
    })

    r.useEffect(() => {
        if (status_loadgrace === false) {
            status_loadgrace_set(true)
        }

        const timer_id = setTimeout(() => {
            status_loadgrace_set(false)
        }, 1e3)

        return () => {
            clearTimeout(timer_id)
        }
    }, [params.id])

    return [
        r.useMemo(() => {
            const data = commision_join?.data

            if (data && data.deleted !== 1) {
                return data
            }

            return null
        }, [commision_join?.data]),
        r.useMemo(() => {
            return {
                status_pending: commision_status_pending,
                status_loadgrace: status_loadgrace,
            }
        }, [commision_status_pending, status_loadgrace])
    ]
}

export type EFCommision__PageView_Props = {

}

export const EFCommision_PageView: r.FC<EFCommision__PageView_Props> = props => {
    const { t } = ri18.useTranslation()
    const navigate = rr.useNavigate()
    const dispatch = asr.useAtomDispatch()

    const urlquery = rr.useParams()
    const [urlsearch] = rr.useSearchParams()
    const commision_id = urlquery.id
    const commision_id_public = urlsearch.get("id_public")

    if (typeof commision_id !== "string") {
        throw new Error(`No id Param`)
    }

    const acc = useAuthAcc()
    const cache_price = r.useMemo(() => new WeakMap<{}, number>(), [])
    const cache_unavailable = r.useMemo(() => new WeakMap<{}, boolean>(), [])

    const [commision, commision_meta] = useCommision({
        id: commision_id,
        id_public: commision_id_public,
    })

    const price_total = useEFCommisionPrice({
        cache_price,
        ref_list: commision?.refnodes ?? [],
        ref_pick_node: refnode => refnode.node,
        ref_pick_quantity: ref => Math.max(0, ref.quantity),
    })

    const [city_sel, city_sel_set] = r.useState<number | null>(null)
    const [parent_sel, parent_sel_set] = r.useState<number | null>(null)

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
                    numid: parent_sel,
                }
            }

            if (typeof city_view_sel?.parent__numid === "number") {
                return {
                    numid: city_view_sel?.parent__numid,
                }
            }

            return null
        }, [parent_sel, city_view_sel]),
    }))

    const parent_view_infer = r.useMemo(() => {
        if (commision?.delivery_division) {
            return {
                name: commision.delivery_division.parent_name,
                numid: commision.delivery_division.parent_numid,
                country__code: commision.delivery_division.country_code,
            } satisfies remx.RemXDelivery_ParentNodeDef["data"]
        }

        return null
    }, [commision?.delivery_division])

    const parent_view = parent_view_sel ?? parent_view_infer

    const city_view_infer = r.useMemo(() => {
        if (commision?.delivery_division) {
            return {
                name: commision.delivery_division.city_name,
                numid: commision.delivery_division.city_numid,
                parent__numid: commision.delivery_division.city_numid
            } satisfies remx.RemXDelivery_CityNodeDef["data"]
        }

        return null
    }, [commision?.delivery_division])

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

        param: r.useMemo(() => ({
            country__code: "UA",
        } as const), []),
    } as const)))

    useAtomLoaderFallback(useAtomWrapFallback(useAtomChildFallback({
        family: remx.delivery_city.loaders.get_byparent,

        param: r.useMemo(() => typeof parent_view?.numid === "number" ? {
            parent__numid: parent_view?.numid,
        } : null, [parent_view?.numid]),
    } as const)))

    useAtomLoaderFallback(useAtomWrapFallback(useAtomChildFallback({
        family: rem.delivery_division.loaders.get,

        param: r.useMemo(() => typeof city_view?.numid === "number" && acc ? {
            pick_parents: null,
            pick_cities: [city_view?.numid],

            pick_owner: [acc.id],
            include_hidden: null,
        } : null, [city_view?.numid, acc]),
    } as const)))

    useLoad({
        id: commision_id,
        acc_id: acc?.id ?? null,
        id_public: commision_id_public,
    })

    const commision_status_static = (
        (commision?.status_static ?? 0) === 1
        && (acc?.access ?? cst.AccountAccess.Casual) <= cst.AccountAccess.Casual
    )

    const children_status_static = (
        (acc?.access ?? cst.AccountAccess.Casual) <= cst.AccountAccess.Casual
    )

    const nodes_someunavailable = commision?.refnodes.some(refnode => {
        return efcommision__node_unavailable({
            cache_unavailable,
            node: refnode.node,
            mode_strict: false,
        })
    }) ?? false

    if (commision) {
        return <main className={st.root}>
            <div className={st.form}>
                <div className={st.form__line_head}>
                    <h3 className={st.identifier}>
                        # {commision.id_public.replace(/(\d\d\d\d)(?!$)/g, "$1-")}
                    </h3>
                </div>

                <div className={st.form__line_ddns}>
                    <ELCommision_FormField title={t("commons.oblast") + "*"} style_flexgrow>
                        <EPInOption_View
                            kind_search={true}
                            theme={stheme_inoption_form}
                            placeholder={t("commons.placeholder_oblast_select")}
                            status_disabled={parents.length === 0 || commision_status_static}
                            option_list={parents}
                            option_name_new={parent => parent.name}
                            option_key_new={parent => parent.numid}
                            option_selection={parent_view ? [parent_view] : null}

                            option_selection_set={node => {
                                city_sel_set(null)
                                parent_sel_set(node.numid)

                                dispatch(rem.commision.act.patch({
                                    body: {
                                        id: commision.id,

                                        patch: {
                                            delivery_division__id: null,
                                        },
                                    },
                                }))
                            }}
                        />
                    </ELCommision_FormField>

                    <ELCommision_FormField title={t("commons.city") + "*"} style_flexgrow>
                        <EPInOption_View
                            kind_search={true}
                            theme={stheme_inoption_form}
                            placeholder={t("commons.placeholder_city_select")}
                            status_disabled={cities.length === 0 || commision_status_static}
                            option_list={cities}
                            option_name_new={city => city.name}
                            option_key_new={city => city.numid}
                            option_selection={city_view ? [city_view] : null}

                            option_selection_set={node => {
                                city_sel_set(node.numid)

                                dispatch(rem.commision.act.patch({
                                    body: {
                                        id: commision.id,

                                        patch: {
                                            delivery_division__id: null,
                                        },
                                    },
                                }))
                            }}
                        />
                    </ELCommision_FormField>

                    <ELCommision_FormField title={t("commons.delivery_terminal") + "*"} style_flexgrow>
                        <EPInOption_View
                            kind_search={true}
                            theme={stheme_inoption_form}
                            status_disabled={terminals.length === 0 || commision_status_static}
                            placeholder={t("commons.placeholder_delivery_terminal_select")}

                            option_list={terminals}
                            option_key_new={terminal => terminal.numid}
                            option_name_new={terminal => terminal.name_short}
                            option_selection={commision.delivery_division ? [commision.delivery_division] : null}

                            option_selection_set={node => {
                                dispatch(rem.commision.act.patch({
                                    body: {
                                        id: commision.id,

                                        patch: {
                                            delivery_division__id: node.id,
                                        },
                                    },
                                }))
                            }}
                        />
                    </ELCommision_FormField>
                </div>

                <div className={st.form__line_contacts}>
                    <ELCommision_FormField title={t("commons.email")} style_flexgrow>
                        <EPInText_ViewWeak
                            stmod={st_intext}
                            className={cl(st.intext)}
                            value={commision.contact_email}
                            state_disabled={commision_status_static}
                            value_validator={value => value === "" || z.email().safeParse(value).success}
                        >
                            <EPInText_Input
                                placeholder={t("commons.placeholder_email")}

                                event_value_change={value => {
                                    dispatch(rem.commision.act.patch({
                                        body: {
                                            id: commision.id,

                                            patch: {
                                                contact_email: value
                                            },
                                        },
                                    }))
                                }}
                            />
                        </EPInText_ViewWeak>
                    </ELCommision_FormField>

                    <ELCommision_FormField title={t("commons.phone")} style_flexgrow>
                        <EPInText_ViewWeak
                            value_nosync
                            stmod={st_intext}
                            className={cl(st.intext)}
                            value={commision.contact_phone}
                            state_disabled={commision_status_static}
                            value_validator={value => value === "" || value.replace(/\D/g, "").length === 10}
                        >
                            <EPInText_Input
                                mask={`(000) 000 00 00`}
                                placeholder={t("commons.placeholder_phone_ua")}

                                event_value_change={(value) => {
                                    dispatch(rem.commision.act.patch({
                                        body: {
                                            id: commision.id,

                                            patch: {
                                                contact_phone: value.replaceAll(/\D/g, "")
                                            },
                                        },
                                    }))
                                }}
                            />
                        </EPInText_ViewWeak>
                    </ELCommision_FormField>
                </div>

                <div className={st.form__line_names}>
                    <ELCommision_FormField title={t("commons.familyname") + "*"} style_flexgrow>
                        <EPInText_ViewWeak
                            value={commision.contact_lname}
                            stmod={st_intext}
                            state_disabled={commision_status_static}
                        >
                            <EPInText_Input
                                type={`text`}
                                placeholder={t("commons.placeholder_familyname")}

                                event_value_change={value => {
                                    dispatch(rem.commision.act.patch({
                                        body: {
                                            id: commision.id,

                                            patch: {
                                                contact_lname: value,
                                            },
                                        },
                                    }))
                                }}
                            />
                        </EPInText_ViewWeak>
                    </ELCommision_FormField>

                    <ELCommision_FormField title={t("commons.firstname") + "*"} style_flexgrow>
                        <EPInText_ViewWeak
                            value={commision.contact_fname}
                            stmod={st_intext}
                            state_disabled={commision_status_static}
                        >
                            <EPInText_Input
                                type={`text`}
                                placeholder={t("commons.placeholder_firstname")}

                                event_value_change={value => {
                                    dispatch(rem.commision.act.patch({
                                        body: {
                                            id: commision.id,

                                            patch: {
                                                contact_fname: value,
                                            },
                                        },
                                    }))
                                }}
                            />
                        </EPInText_ViewWeak>
                    </ELCommision_FormField>

                    <ELCommision_FormField title={t("commons.patronym")} style_flexgrow>
                        <EPInText_ViewWeak
                            value={commision.contact_pname}
                            stmod={st_intext}
                            state_disabled={commision_status_static}
                        >
                            <EPInText_Input
                                type={`text`}
                                placeholder={t("commons.placeholder_patronym")}

                                event_value_change={value => {
                                    dispatch(rem.commision.act.patch({
                                        body: {
                                            id: commision.id,

                                            patch: {
                                                contact_pname: value,
                                            },
                                        },
                                    }))
                                }}
                            />
                        </EPInText_ViewWeak>
                    </ELCommision_FormField>
                </div>

                <div className={st.form__line_payments}>
                    <h3 className={st.price}>
                        {price_total} {t("currency.uah")}
                    </h3>

                    <EPCardImg_Headln_Btn
                        icon={`cart`}
                        style_anim_swiperight={false}

                        state_disabled={
                            nodes_someunavailable
                            || !commision.delivery_division
                            || (commision.contact_phone !== "" && commision.contact_phone.length !== 10)
                            || (commision.contact_email !== "" && !z.email().safeParse(commision.contact_email).success)
                            || (commision.contact_fname.trim().length === 0)
                            || (commision.contact_lname.trim().length === 0)
                            || (commision.contact_pname.trim().length === 0)
                        }
                    >
                        {t("commision.continue_to_payments")}
                    </EPCardImg_Headln_Btn>
                </div>
            </div>

            <div className={st.alerts}>
                <rfl.CmpIf value={nodes_someunavailable && !commision.paynment_amount}>
                    {() => <div className={cl(st.alert, st._error)}>
                        {t("commision.alert_nomaterials_view_1")}

                        <br />
                        <br />

                        {t("commision.alert_nomaterials_view_2")}

                        <br />
                        <br />

                        {t("commision.alert_nomaterials_view_3")}

                        <br />
                        <br />

                        <div className={st.alert__acts}>
                            <button
                                className={st.alert__act}

                                onClick={() => {
                                    const owner = commision.owner

                                    if (typeof owner !== "string") {
                                        return
                                    }

                                    dispatch(rem.cart_refnode.act.post({
                                        body: commision.refnodes.map(refnode => {
                                            const cartref_id = uuid()
                                            const commision_node_id = uuid()

                                            return {
                                                core: {
                                                    owner: owner,
                                                    id: cartref_id,
                                                    quantity: refnode.quantity,
                                                    commision_node__id: commision_node_id,
                                                },

                                                joins: {
                                                    node: remclone_commision_node({
                                                        src: refnode.node,

                                                        overrides: {
                                                            owner,
                                                            commision_node_id,
                                                        },
                                                    }),
                                                },
                                            } satisfies cc.Rest["cart_refnode"]["post"]["body"][number]
                                        }),

                                        config: {
                                            events: {
                                                success: () => {
                                                    navigate(urlmap.shared.commision_finish())

                                                    dispatch(rem.commision.act.delete({
                                                        body: {
                                                            ids: [commision.id]
                                                        },
                                                    }))
                                                },

                                                failure: () => {
                                                    dispatch(gv.report.act.push_error({
                                                        text: t("popups.error.commision_backtocart_default")
                                                    }))
                                                },
                                            }
                                        }
                                        ,
                                    }))
                                }}
                            >
                                {t("commision.back_to_cart")}
                            </button>
                        </div>
                    </div>}
                </rfl.CmpIf>
            </div >

            <div className={st.grid}>
                <rfl.CmpLoop data={commision.refnodes}>
                    {cnode => {
                        return <ELCommision_CardCartItem
                            key={cnode.id}

                            status_static={children_status_static}
                            status_hideerror={Boolean(commision.paynment_amount)}

                            node={cnode.node}
                            state_disabled={false}
                            cache_price={cache_price}
                            state_disabled_forced={false}

                            refnode_id={cnode.id}
                            refnode_name={"commision_refnode"}
                            refnode_quantity={cnode.quantity}
                        />
                    }}
                </rfl.CmpLoop>
            </div>
        </main >
    } else {
        if (commision_meta.status_pending || commision_meta.status_loadgrace) {
            return <EFStatusPage_Pending />
        }

        return <EFStatusPage_NotFound />
    }
}

export default EFCommision_PageView
