import * as cst from "@fst/cst"
import * as gs from "@fst/gstate"
import { gv, rem, remx } from "@fst/gstate"
import * as asr from "@qyu/atom-state-react"
import * as rfl from "@qyu/reactcmp-flow-control"
import * as sc from "@qyu/signal-core"
import * as sr from "@qyu/signal-react"
import st from "@src/client/component/feature/home/style/card_item.module.scss"
import EPCardImg_Headln from "@src/client/component/primitive/card-img/element/headln"
import EPCardImg_Headln_Btn from "@src/client/component/primitive/card-img/element/headln__btn"
import EPCardImg_Headln_Link from "@src/client/component/primitive/card-img/element/headln__link"
import EPCardImg_Headln_Title from "@src/client/component/primitive/card-img/element/headln__title"
import EPCardImg_ImgLink from "@src/client/component/primitive/card-img/element/img_link"
import EPCardImg_LayerFView from "@src/client/component/primitive/card-img/element/layerf_view"
import EPCardImg_LayoutInfo from "@src/client/component/primitive/card-img/element/layout_info"
import EPCardImg_LayoutLine from "@src/client/component/primitive/card-img/element/layout_line"
import EPCardImg_LayoutMainCol from "@src/client/component/primitive/card-img/element/layout_maincol"
import EPCardImg_LayoutVarCol from "@src/client/component/primitive/card-img/element/layout_varcol"
import EPCardImg_VarBtn from "@src/client/component/primitive/card-img/element/var_btn"
import EPCardImg_VarLink from "@src/client/component/primitive/card-img/element/var_link"
import EPCardImg_View from "@src/client/component/primitive/card-img/element/view"
import type { FnSetterStateful } from "@src/client/type/fns"
import { urlmap } from "@src/client/urlmap"
import { imgref_data_apiurl } from "@src/client/util/imgref/data/apiurl"
import { imgref_data_top } from "@src/client/util/imgref/data/top"
import { postbody_new_commision_node } from "@src/client/util/postdata/new/commision_node"
import { lang_prop } from "@src/client/util/tl/prop"
import { variant_price_new } from "@src/client/util/variant/price"
import cl from "classnames"
import * as r from "react"
import * as ri18 from "react-i18next"
import { v7 as uuid } from "uuid"

type Data_Variant = gs.Rem_JoinData<"variant">

const href_new = function(id: string, search: readonly (readonly [string, string | null])[]) {
    const search_real = search.filter(n => n[1] !== null)

    const search_str = (search_real.length
        ? `?${search_real.map(n => {
            return `${n[0]}=${encodeURIComponent(n[1]!)}`
        }).join("&")}`
        : ``
    )

    return `${urlmap.public.view_item({ id })}${search_str}`
}

const useVariantActive = function(variants: readonly Data_Variant[]): [Data_Variant | null, string | null, FnSetterStateful<string | null>] {
    let ref_lastcheck = r.useRef<number | null>(null)

    const [selection, selection_set] = r.useState<string | null>(null)

    const variant_active = r.useMemo(() => {
        if (selection === null) {
            ref_lastcheck.current = null

            return variants[0] ?? null
        }

        if (typeof ref_lastcheck.current === "number") {
            const variant = variants[ref_lastcheck.current]

            if (variant && variant.id === selection) {
                return variant
            }
        }

        for (let i = 0; i < variants.length; ++i) {
            const variant = variants[i]!

            if (variant.id === selection) {
                ref_lastcheck.current = i

                return variant
            }
        }

        {
            ref_lastcheck.current = null

            return null
        }
    }, [variants, selection])

    return [variant_active, selection, selection_set]
}

type EL__View_Props = {
    readonly node: gs.Rem_JoinData<"item">
    readonly variants_public: readonly gs.Rem_JoinData<"variant">[]
}

const EL_View: r.FC<EL__View_Props> = props => {
    const dispatch = asr.useAtomDispatch()
    const { t, i18n } = ri18.useTranslation()

    const img_srcdef = imgref_data_apiurl(imgref_data_top(props.node.refimgs))

    const acc = sr.useSignalOutput(asr.useAtomValue(
        r.useCallback(({ reg }) => {
            return sc.osignal_new_memo(
                sc.osignal_new_pipe(
                    reg(remx.auth.joins.core())({}),
                    join => join?.data ?? null,
                ),
                null
            )
        }, [])
    ))

    const [variant_active, , variant_select] = useVariantActive(props.variants_public)

    const price = r.useMemo(() => {
        if (!variant_active) {
            return 0
        }

        return variant_price_new({
            variant: variant_active,
        })
    }, [variant_active])

    const variant_id_s = sr.useSignalValue(variant_active?.id)

    const repres_cart = asr.useAtomOutput(
        r.useCallback(({ reg }) => {
            return sc.osignal_new_memo(
                sc.osignal_new_pipe(
                    sc.osignal_new_merge([
                        sc.osignal_new_pipeflat(
                            sc.osignal_new_listpipe(
                                reg(rem.cart_refnode.indexer_new(["deleted", "owner"])).reg({
                                    deleted: 0,
                                    owner: acc?.id ?? "never",
                                }),
                                refnode => {
                                    return reg(rem.cart_refnode.joins.core())({
                                        id: refnode.statics.id,
                                    })
                                }
                            ),
                            sc.osignal_new_merge
                        ),
                        variant_id_s
                    ] as const),
                    ([joins, variant_id]) => {
                        for (const join of joins) {
                            if (
                                join
                                && join.data
                                && !join.data.deleted
                                && join.data.node.variant__id === variant_id
                                && join.data.node.item__id === props.node.id
                            ) {
                                return join.data
                            }
                        }

                        return null
                    },
                ),
                Object.is,
            )
        }, [props.node.id, variant_id_s, acc?.id])
    )

    asr.useAtomLoader({
        atomloader: remx.auth.loaders.check,
        params: []
    })

    const href_customise = href_new(props.node.id, [])
    const href = href_new(props.node.id, [["variant", variant_active?.id ?? null]])

    return <EPCardImg_View>
        <EPCardImg_LayerFView>
            <EPCardImg_LayoutMainCol>
                <EPCardImg_LayoutLine>
                    <EPCardImg_LayoutMainCol>
                        <EPCardImg_ImgLink href={href} {...img_srcdef} sizes={`50vw`} />
                    </EPCardImg_LayoutMainCol>

                    <EPCardImg_LayoutVarCol>
                        <EPCardImg_VarLink text={t("item.customise")} href={href_customise} />

                        <rfl.CmpLoop data={props.variants_public}>
                            {variant => {
                                return <EPCardImg_VarBtn
                                    key={variant.id}

                                    text={lang_prop(variant, i18n.language, "header")}
                                    state_active={variant_active?.id === variant.id}

                                    event_click={() => {
                                        variant_select(variant.id)
                                    }}
                                />
                            }}
                        </rfl.CmpLoop>
                    </EPCardImg_LayoutVarCol>
                </EPCardImg_LayoutLine>

                <EPCardImg_LayoutInfo>
                    <EPCardImg_Headln className={st.headln}>
                        <EPCardImg_Headln_Title>
                            {`${price.toString()}`} {t("currency.uah")}
                        </EPCardImg_Headln_Title>

                        <EPCardImg_Headln_Btn
                            icon={`cart`}
                            style_anim_swiperight={false}
                            className={cl(st.cartbtn, st.headln__btn, repres_cart && st._active)}

                            event_click={() => {
                                if (repres_cart) {
                                    dispatch(rem.cart_refnode.act.delete({
                                        body: {
                                            ids: [repres_cart.id],
                                        }
                                    }))

                                    return
                                }

                                const id = uuid()
                                const acc_id = acc?.id

                                if (typeof acc_id === "string" && variant_active) {
                                    const commision_node_id = uuid()

                                    dispatch(rem.cart_refnode.act.post({
                                        body: [{
                                            core: {
                                                id,

                                                quantity: 1,

                                                owner: acc_id,
                                                commision_node__id: commision_node_id,
                                            },

                                            joins: {
                                                node: postbody_new_commision_node({
                                                    overrides: {
                                                        owner: acc_id,
                                                    },

                                                    src: {
                                                        id: commision_node_id,
                                                        prodset: variant_active.prodset,

                                                        item_id: props.node.id,
                                                        item_name: props.node.name,
                                                        item_tl: props.node.tl,
                                                        item_refimgs: props.node.refimgs,

                                                        variant_id: variant_active.id,
                                                        variant_tl: variant_active.tl,
                                                        variant_header: variant_active.header,

                                                        tmplit_id: props.node.template.id,
                                                        tmplit_tl: props.node.template.tl,
                                                        tmplit_name: props.node.template.name,
                                                    },
                                                }),
                                            },
                                        }],

                                        config: {
                                            events: {
                                                failure: () => {
                                                    dispatch(gv.report.act.push_error({
                                                        text: t(`popups.error.add_to_the_cart_default`)
                                                    }))
                                                },
                                            },
                                        },
                                    }))
                                }
                            }}
                        >
                            {repres_cart ? t(`commons.in_the_cart`) : t(`commons.add_to_the_cart`)}
                        </EPCardImg_Headln_Btn>

                        <EPCardImg_Headln_Link href={href} className={st.headln__btn}>
                            {t(`commons.explore`)}
                        </EPCardImg_Headln_Link>
                    </EPCardImg_Headln>
                </EPCardImg_LayoutInfo>
            </EPCardImg_LayoutMainCol>
        </EPCardImg_LayerFView>
    </EPCardImg_View>
}

export type ELHome__CardItem_Mtops = Readonly<{
    readonly node: gs.Rem_JoinData<"item">
}>

export const ELHome_CardItem: r.FC<ELHome__CardItem_Mtops> = props => {
    const variants_public = r.useMemo(() => {
        return props.node.variants.filter(variant => typeof variant.owner !== "string")
    }, [props.node.variants])

    const status_hidden = r.useMemo(() => {
        for (const variant of variants_public) {
            for (const product of variant.prodset.products) {
                for (const arg of product.template.args) {
                    const argmat = arg.defs_mat[0]

                    if (arg.kind === cst.TmplPrArg_Kind.Mat && argmat) {
                        const imp = product.argimps_mat.find(n => n.tmplpr_arg_mat__id === argmat.id)

                        if (!imp || imp.value === undefined || !imp.value.status_available) {
                            return true
                        }
                    }
                }
            }
        }

        return false
    }, [variants_public])

    if (status_hidden) {
        return null
    }

    return <EL_View
        node={props.node}
        variants_public={variants_public}
    />
}
