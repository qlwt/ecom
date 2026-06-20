import st from "@client/component/feature/commision/style/card_cartitem.module.scss"
import * as cc from "@fst/config/client"
import { rem } from "@fst/gstate"
import * as asr from "@qyu/atom-state-react"
import * as rfl from "@qyu/reactcmp-flow-control"
import ELCommision_CardProduct from "@src/client/component/feature/commision/local/card_product"
import EPAction_BtnClick from "@src/client/component/primitive/action/element/btn_click"
import EPAction_BtnToggle from "@src/client/component/primitive/action/element/btn_toggle"
import EPCardImg_ImgView from "@src/client/component/primitive/card-img/element/img_view"
import EPCardImg_LayerFView from "@src/client/component/primitive/card-img/element/layerf_view"
import EPCardImg_LayoutMainCol from "@src/client/component/primitive/card-img/element/layout_maincol"
import EPCardImg_View from "@src/client/component/primitive/card-img/element/view"
import { useMemoThrottle } from "@src/client/hook/memo_throttle"
import { formula_price_new_commision_node } from "@src/client/util/formula_price/new/commision_node"
import { imgref_data_apiurl } from "@src/client/util/imgref/data/apiurl"
import { lang_prop } from "@src/client/util/tl/prop"
import cl from "classnames"
import * as r from "react"
import * as ri18 from "react-i18next"

type EL__Quantity_Props = {
    readonly status_static: boolean

    readonly refnode_id: string
    readonly refnode_quantity: number
    readonly refnode_name: "cart_refnode" | "commision_refnode"
}

const EL_Quantity: r.FC<EL__Quantity_Props> = props => {
    const dispatch = asr.useAtomDispatch()

    return <rfl.CmpIf
        value={!props.status_static}

        fallback={() => {
            return <div className={cl(st.quantity, st._placeholder)}>
                <div className={st.quantity__view}>
                    {props.refnode_quantity}
                </div>
            </div>
        }}
    >
        {() => <div className={st.quantity}>
            <button
                className={cl(st.quantity__btn, st._border_right)}

                onClick={() => {
                    const now_quantity = Math.max(1, props.refnode_quantity - 1)

                    if (now_quantity !== props.refnode_quantity) {
                        dispatch(rem[props.refnode_name].act.patch({
                            body: {
                                id: props.refnode_id,

                                patch: {
                                    quantity: now_quantity,
                                },
                            },
                        }))
                    }
                }}
            >
                -
            </button>

            <input
                min={0}
                max={999}
                className={st.quantity__input}
                value={props.refnode_quantity.toString()}

                onChange={ev => {
                    const value_raw = ev.currentTarget.value
                    const value_parsed = Math.max(1, Number.parseInt(value_raw))

                    if (!Number.isNaN(value_parsed) && value_parsed !== props.refnode_quantity) {
                        dispatch(rem[props.refnode_name].act.patch({
                            body: {
                                id: props.refnode_id,
                                patch: {
                                    quantity: value_parsed,
                                },
                            },
                        }))
                    }
                }}
            />

            <button
                className={cl(st.quantity__btn, st._border_left)}

                onClick={() => {
                    dispatch(rem[props.refnode_name].act.patch({
                        body: {
                            id: props.refnode_id,

                            patch: {
                                quantity: props.refnode_quantity + 1,
                            },
                        },
                    }))
                }}
            >
                +
            </button>
        </div>}
    </rfl.CmpIf>
}

type Data_CommisionNode = cc.RemDef["commision_node"]["joins"]["core"]

export type ELCommision__CardCartItem_Props = {
    readonly status_static: boolean
    readonly status_hideerror: boolean

    readonly node: Data_CommisionNode
    readonly cache_price: WeakMap<{}, number>

    readonly refnode_id: string
    readonly refnode_quantity: number
    readonly refnode_name: "cart_refnode" | "commision_refnode"

    readonly state_disabled: boolean
    readonly state_disabled_forced: boolean
    readonly state_disabled_toggle?: (id: string) => void
}

export const ELCommision_CardCartItem: r.FC<ELCommision__CardCartItem_Props> = r.memo(props => {
    const { t, i18n } = ri18.useTranslation()
    const dispatch = asr.useAtomDispatch()
    const img_srcdef = imgref_data_apiurl(props.node.refimgs[0] ?? null)

    const price = useMemoThrottle({
        delay: 500,
        deps_upd: [props.node],
        deps_force: [props.node.id, props.refnode_quantity],

        cb: () => {
            let result = props.cache_price.get(props.node)

            if (typeof result !== "number") {
                result = formula_price_new_commision_node({
                    commision_node: props.node
                })

                props.cache_price.set(props.node, result)
            }

            return result
        },
    })

    const node_tmplit_name = lang_prop(props.node, i18n.language, "tmplit_name").trim()
    const node_variant_header = lang_prop(props.node, i18n.language, "variant_header").trim()

    return <div className={cl(st.root, props.state_disabled && st._disabled)}>
        <div className={st.head}>
            <EPCardImg_View className={st.head__preview}>
                <EPCardImg_LayerFView>
                    <EPCardImg_LayoutMainCol>
                        <EPCardImg_ImgView {...img_srcdef} sizes={`40vw`} />
                    </EPCardImg_LayoutMainCol>
                </EPCardImg_LayerFView>
            </EPCardImg_View>

            <div className={cl(st.head__info)}>
                <div className={st.head__info__line}>
                    <h2 className={st.head__title}>
                        {node_tmplit_name}
                    </h2>

                    <div className={st.head__variant}>
                        {node_variant_header}
                    </div>
                </div>
            </div>

            <div className={cl(st.head__acts)}>
                <div className={st.head__acts__line}>
                    <span className={st.head__price}>
                        {price} {t("currency.uah")}
                    </span>

                    <EL_Quantity
                        status_static={props.status_static}
                        refnode_id={props.refnode_id}
                        refnode_name={props.refnode_name}
                        refnode_quantity={props.refnode_quantity}
                    />

                    <rfl.CmpRequire value={[props.state_disabled_toggle] as const}>
                        {([state_disabled_toggle]) => {
                            return <EPAction_BtnToggle
                                style_root
                                style_shadow_type={`none`}

                                icon={`check`}
                                className={st.head__act}
                                state_active={(!props.state_disabled && !props.state_disabled_forced)}

                                event_click={() => {
                                    if (!props.state_disabled_forced) {
                                        state_disabled_toggle(props.refnode_id)
                                    }
                                }}
                            />
                        }}
                    </rfl.CmpRequire>

                    <rfl.CmpIf value={!props.status_static}>
                        {() => <EPAction_BtnClick
                            style_root
                            style_redclr
                            style_shadow_type={`none`}

                            icon={`trashcan`}
                            className={st.head__act}

                            event_click={() => {
                                dispatch(rem[props.refnode_name].act.delete({
                                    body: {
                                        ids: [props.refnode_id],
                                    },
                                }))
                            }}
                        />}
                    </rfl.CmpIf>
                </div>
            </div>
        </div>

        <div className={st.grid}>
            <rfl.CmpLoop data={props.node.products}>
                {product => {
                    return <ELCommision_CardProduct
                        key={product.id}

                        node={product}
                        status_hideerror={props.status_hideerror}
                    />
                }}
            </rfl.CmpLoop>
        </div>
    </div>
})

export default ELCommision_CardCartItem
