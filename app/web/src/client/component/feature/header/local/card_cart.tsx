import * as gs from "@fst/gstate"
import { rem } from "@fst/gstate"
import * as asr from "@qyu/atom-state-react"
import st from "@src/client/component/feature/header/style/card_cart.module.scss"
import EPAction_BtnClick from "@src/client/component/primitive/action/element/btn_click"
import EPCardImg_ImgView from "@src/client/component/primitive/card-img/element/img_view"
import EPCardImg_LayerFView from "@src/client/component/primitive/card-img/element/layerf_view"
import EPCardImg_LayoutMainCol from "@src/client/component/primitive/card-img/element/layout_maincol"
import EPCardImg_View from "@src/client/component/primitive/card-img/element/view"
import { formula_price_new_commision_node } from "@src/client/util/formula_price/new/commision_node"
import { imgref_data_apiurl } from "@src/client/util/imgref/data/apiurl"
import { lang_prop } from "@src/client/util/tl/prop"
import cl from "classnames"
import * as r from "react"
import * as ri18 from "react-i18next"

export type ELHeader__CardCart_Props = {
    readonly refnode: gs.Rem_JoinData<"cart_refnode">
}

export const ELHeader_CardCart: r.FC<ELHeader__CardCart_Props> = props => {
    const { t, i18n } = ri18.useTranslation()

    const dispatch = asr.useAtomDispatch()
    const img_src = imgref_data_apiurl(props.refnode.node.refimgs[0] ?? null)

    const price = r.useMemo(() => {
        return (
            props.refnode.quantity
            * formula_price_new_commision_node({ commision_node: props.refnode.node })
        )
    }, [props.refnode.node, props.refnode.quantity])

    return <div className={cl(st.root_item)}>
        <EPCardImg_View className={st.info__img__view}>
            <EPCardImg_LayerFView style_shadow_type={`none`}>
                <EPCardImg_LayoutMainCol>
                    <EPCardImg_ImgView {...img_src} sizes={`30vw`} />
                </EPCardImg_LayoutMainCol>
            </EPCardImg_LayerFView>
        </EPCardImg_View>

        <div className={cl(st.info_item)}>
            <div className={st.info_item__topline}>
                <div className={st.info_item__head}>
                    <h3 className={st.info__header}>
                        {lang_prop(props.refnode.node, i18n.language, "tmplit_name")}
                    </h3>

                    <span className={st.info__variant}>
                        {lang_prop(props.refnode.node, i18n.language, "variant_header")}
                    </span>
                </div>

                <div className={st.info_item__acts}>
                    <EPAction_BtnClick
                        style_root
                        style_redclr
                        style_shadow_type={`none`}

                        icon={`trashcan`}
                        className={st.info__act}

                        event_click={() => {
                            dispatch(rem.cart_refnode.act.delete({
                                body: {
                                    ids: [props.refnode.id],
                                },
                            }))
                        }}
                    />
                </div>
            </div>

            <div className={st.info_item__priceline}>
                <span className={st.info__price}>
                    {price} {t("currency.uah")}
                </span>

                <div className={st.quantity}>
                    <button
                        className={cl(st.quantity__btn, st._border_right)}

                        onClick={() => {
                            const now_quantity = Math.max(1, props.refnode.quantity - 1)

                            if (now_quantity !== props.refnode.quantity) {
                                dispatch(rem.cart_refnode.act.patch({
                                    body: {
                                        id: props.refnode.id,

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
                        value={props.refnode.quantity.toString()}

                        onChange={ev => {
                            const value_raw = ev.currentTarget.value
                            const value_parsed = Math.max(1, Number.parseInt(value_raw))

                            if (!Number.isNaN(value_parsed) && value_parsed !== props.refnode.quantity) {
                                dispatch(rem.cart_refnode.act.patch({
                                    body: {
                                        id: props.refnode.id,

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
                            dispatch(rem.cart_refnode.act.patch({
                                body: {
                                    id: props.refnode.id,

                                    patch: {
                                        quantity: props.refnode.quantity + 1,
                                    },
                                },
                            }))
                        }}
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    </div>
}

export default ELHeader_CardCart
