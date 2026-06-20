import st from "@client/component/feature/home-view/style/sec_variant.module.scss"
import * as cst from "@fst/cst"
import * as dbdef from "@fst/db-default"
import * as gs from "@fst/gstate"
import { gv, rem } from "@fst/gstate"
import * as sxm from "@fst/syntax-math"
import * as asr from "@qyu/atom-state-react"
import * as ddn from "@qyu/reactcmp-dropdown"
import * as rfl from "@qyu/reactcmp-flow-control"
import * as sc from "@qyu/signal-core"
import * as sr from "@qyu/signal-react"
import * as sx from "@qyu/syntax-core"
import { EFHomeView_ModalState } from "@src/client/component/feature/home-view/type/modalstate"
import { EFHomeView_Selection_ActName, EFHomeView_Selection_Kind, type EFHomeView_Selection } from "@src/client/component/feature/home-view/type/selection"
import EPAction_BtnClick from "@src/client/component/primitive/action/element/btn_click"
import EPAction_BtnToggle from "@src/client/component/primitive/action/element/btn_toggle"
import EPCardImg_Headln from "@src/client/component/primitive/card-img/element/headln"
import EPCardImg_Headln_Btn from "@src/client/component/primitive/card-img/element/headln__btn"
import EPProduct_View from "@src/client/component/primitive/product/element/view"
import EPSelectList_TmplPr from "@src/client/component/primitive/selectlist/element/tmplpr"
import { domroot_dropdown } from "@src/client/const/domroot"
import { useAuthAcc } from "@src/client/hook/auth/acc"
import { useMemoThrottle } from "@src/client/hook/memo_throttle"
import type { FnSetterStateles } from "@src/client/type/fns"
import { postbody_new_commision_node } from "@src/client/util/postdata/new/commision_node"
import { lang_prop } from "@src/client/util/tl/prop"
import { variant_price_new } from "@src/client/util/variant/price"
import cl from "classnames"
import * as r from "react"
import * as ri18 from "react-i18next"
import { v7 as uuid } from "uuid"

type Data_Variant = gs.Rem_JoinData<"variant">

type EL_ProductPost_Props = {
    readonly prodset_id: string
}

const EL_ProductPost: r.FC<EL_ProductPost_Props> = props => {
    const dispatch = asr.useAtomDispatch()

    const ref_btn = r.useRef<HTMLButtonElement | null>(null)
    const oref_btn = r.useCallback(() => ref_btn.current, [])

    const acc = useAuthAcc()
    const [open, open_set] = r.useState(false)

    return <ddn.CmpContainerVirtual
        open={open}
        open_set={open_set}
    >
        <ddn.CmpButtonVirtual target={oref_btn}>
            <EPAction_BtnToggle
                ref={ref_btn}
                style_root

                icon={`post`}
                state_active={open}
                className={st.sec_view__head__act}

                event_click={() => {
                    open_set(!open)
                }}
            />
        </ddn.CmpButtonVirtual>

        <ddn.CmpListPortal gap={5} portal={domroot_dropdown} align="center">
            <ddn.CmpContent className={st.ddn__content}>
                <EPSelectList_TmplPr
                    include_hidden={0}
                    include_private={0}

                    event_select={tmplpr_ids => {
                        const acc_id = acc?.id

                        if (typeof acc_id === "string") {
                            const id = uuid()

                            for (const tmplpr_id of tmplpr_ids) {
                                dispatch(rem.product.act.post({
                                    body: [{
                                        core: {
                                            ...dbdef.table.product,

                                            id,
                                            owner: acc_id,
                                            tmplpr__id: tmplpr_id,
                                            prodset__id: props.prodset_id,
                                        },

                                        joins: {},
                                    }]
                                }))
                            }
                        }
                    }}
                />
            </ddn.CmpContent>
        </ddn.CmpListPortal>
    </ddn.CmpContainerVirtual>
}

export type ELSecView__SecVariant_Selection_Head_Props = {
    readonly item_id: string
    readonly item_name: string
    readonly item_tl: readonly gs.Rem_JoinData<"item_tl">[]
    readonly item_imgs: readonly gs.Rem_JoinData<"item_refimg">[]

    readonly tmplit_id: string
    readonly tmplit_name: string
    readonly tmplit_tl: readonly gs.Rem_JoinData<"tmplit_tl">[]

    readonly variant: Data_Variant | null
    readonly variant_select: FnSetterStateles<EFHomeView_Selection>
}

export const ELSecView_SecVariant_Selection_Head: r.FC<ELSecView__SecVariant_Selection_Head_Props> = props => {
    const dispatch = asr.useAtomDispatch()
    const { t, i18n } = ri18.useTranslation()

    const acc = useAuthAcc()
    const cache_expr = r.useMemo(() => new Map<string, sx.Tree_Slot<sxm.TreeNode>>(), [])

    const price = useMemoThrottle({
        delay: 100,
        deps_upd: [props.variant],
        deps_force: [props.variant?.id],

        cb: () => {
            if (!props.variant) {
                return 0
            }

            return variant_price_new({
                variant: props.variant,
                cache_expr: cache_expr,
            })
        },
    })

    const variant_id_s = sr.useSignalValue(props.variant?.id)

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
                                && join.data.node.item__id === props.item_id
                            ) {
                                return join.data
                            }
                        }

                        return null
                    },
                ),
                Object.is,
            )
        }, [props.item_id, variant_id_s])
    )

    return <div className={st.sec_view__head}>
        <div className={st.sec_view__head__acts}>
            <rfl.CmpRequire
                value={[props.variant] as const}
                state_empty={([variant]) => typeof variant.owner !== "string"}
            >
                {([variant]) => <>
                    <EL_ProductPost prodset_id={variant.prodset__id} />

                    <EPAction_BtnClick
                        style_root
                        style_redclr

                        icon={`trashcan`}
                        className={st.sec_view__head__act}

                        event_click={() => {
                            props.variant_select({
                                kind: EFHomeView_Selection_Kind.Act,
                                name: EFHomeView_Selection_ActName.NewCustom,
                            })

                            dispatch(rem.variant.act.delete({
                                body: {
                                    ids: [variant.id]
                                },
                            }))
                        }}
                    />
                </>}
            </rfl.CmpRequire>
        </div>

        <EPCardImg_Headln className={st.sec_view__head__cart}>
            {`${price.toString()}`} {t(`currency.uah`)}

            <EPCardImg_Headln_Btn
                icon={`cart`}
                style_anim_swiperight={false}
                className={cl(st.cartbtn, repres_cart && st._active)}

                event_click={() => {
                    if (!acc?.id || !props.variant) {
                        return
                    }

                    if (repres_cart) {
                        dispatch(rem.cart_refnode.act.delete({
                            body: {
                                ids: [repres_cart.id],
                            }
                        }))

                        return
                    }

                    for (const product of props.variant.prodset.products) {
                        for (const arg of product.template.args) {
                            if (arg.kind === cst.TmplPrArg_Kind.Mat && arg.defs_mat[0]) {
                                const arg_mat = arg.defs_mat[0]!
                                const imp = product.argimps_mat.find(n => n.tmplpr_arg_mat__id === arg_mat.id)

                                if (!imp || imp.value === undefined) {
                                    dispatch(gv.report.act.push_error({
                                        text: t("popups.error.add_to_the_cart_nomaterials", {
                                            product_name: lang_prop(product.template, i18n.language, "name")
                                        }),
                                    }))

                                    return
                                }
                            }
                        }
                    }

                    const id = uuid()
                    const acc_id = acc.id

                    if (typeof acc_id === "string") {
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
                                            prodset: props.variant.prodset,

                                            item_id: props.item_id,
                                            item_name: props.item_name,
                                            item_tl: props.item_tl,
                                            item_refimgs: props.item_imgs,

                                            variant_id: props.variant.id,
                                            variant_tl: props.variant.tl,
                                            variant_header: props.variant.header,

                                            tmplit_id: props.tmplit_id,
                                            tmplit_tl: props.tmplit_tl,
                                            tmplit_name: props.tmplit_name,
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
        </EPCardImg_Headln>
    </div >
}

export type ELHomeView__SecVariant_Selection_Grid_Props = {
    readonly variant: Data_Variant | null
    readonly modal_set: FnSetterStateles<EFHomeView_ModalState>
}

export const ELHomeView_SecVariant_Selection_Grid: r.FC<ELHomeView__SecVariant_Selection_Grid_Props> = props => {
    const { t, i18n } = ri18.useTranslation()

    return <rfl.CmpRequire
        value={[props.variant] as const}

        fallback={() => {
            return <div className={cl(st.sec_view__grid_selection, st._empty)}>
                <h1 className={st.sec_view__grid_selection__fallback}>
                    {t(`item.variant_notsel`)}
                </h1>
            </div>
        }}
    >
        {([variant]) => {
            if (variant.prodset.products.length === 0) {
                return <div className={cl(st.sec_view__grid_selection, st._empty)}>
                    <h1 className={st.sec_view__grid_selection__fallback}>
                        {t(`item.variant_empty`)}
                    </h1>
                </div>
            }

            return <div className={cl(st.sec_view__grid_selection, st._full)}>
                <rfl.CmpLoop data={variant.prodset.products}>
                    {product => {
                        return <EPProduct_View
                            key={product.id}

                            style_view
                            product={product}
                            include_hidden={0}
                            include_private={0}

                            lang={i18n.language}
                            lang_fallback={undefined}

                            hook_action={() => {
                                if (variant.owner === null) {
                                    props.modal_set(EFHomeView_ModalState.CustomVariant)

                                    return false
                                }

                                return true
                            }}
                        />
                    }}
                </rfl.CmpLoop>
            </div>
        }}
    </rfl.CmpRequire>
}
