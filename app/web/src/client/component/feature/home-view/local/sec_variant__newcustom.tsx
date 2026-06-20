import st from "@client/component/feature/home-view/style/sec_variant.module.scss"
import * as gs from "@fst/gstate"
import { rem } from "@fst/gstate"
import * as sxm from "@fst/syntax-math"
import * as asr from "@qyu/atom-state-react"
import * as rfl from "@qyu/reactcmp-flow-control"
import * as sx from "@qyu/syntax-core"
import { EFHomeView_Selection_Kind, type EFHomeView_Selection } from "@src/client/component/feature/home-view/type/selection"
import { efhomeview_tls_new_variant_custom } from "@src/client/component/feature/home-view/util/tls/new/variant_custom"
import EPCardImg_Headln from "@src/client/component/primitive/card-img/element/headln"
import EPCardImg_ImgView from "@src/client/component/primitive/card-img/element/img_view"
import EPCardImg_LayerFButton from "@src/client/component/primitive/card-img/element/layerf_button"
import EPCardImg_LayerFView from "@src/client/component/primitive/card-img/element/layerf_view"
import EPCardImg_LayoutMainCol from "@src/client/component/primitive/card-img/element/layout_maincol"
import EPCardImg_View from "@src/client/component/primitive/card-img/element/view"
import { useAuthAcc } from "@src/client/hook/auth/acc"
import type { FnSetterStateles } from "@src/client/type/fns"
import { imgref_data_apiurl } from "@src/client/util/imgref/data/apiurl"
import { remclone_variant } from "@src/client/util/remclone/variant"
import { lang_prop } from "@src/client/util/tl/prop"
import { variant_price_new } from "@src/client/util/variant/price"
import cl from "classnames"
import * as r from "react"
import * as ri18 from "react-i18next"
import { v7 as uuid } from "uuid"

type Data_Variant = gs.Rem_JoinData<"variant">

type EL__CardVariant_Props = {
    readonly variant: Data_Variant
    readonly variant_select: FnSetterStateles<EFHomeView_Selection>
}

const EL_CardVariant: r.FC<EL__CardVariant_Props> = props => {
    const { t, i18n } = ri18.useTranslation()

    const acc = useAuthAcc()
    const dispatch = asr.useAtomDispatch()
    const cache_expr = r.useMemo(() => new Map<string, sx.Tree_Slot<sxm.TreeNode>>(), [])

    const price = r.useMemo(() => {
        return variant_price_new({ variant: props.variant, cache_expr })
    }, [props.variant])

    return <EPCardImg_View>
        <EPCardImg_LayerFButton
            event_click={() => {
                if (!acc || !props.variant) {
                    return
                }

                const prodset_id = uuid()
                const variant_id = uuid()

                dispatch(rem.variant.act.post({
                    body: [remclone_variant({
                        ignore: {},
                        src: props.variant,

                        overrides: {
                            owner: acc.id,
                            status_hidden: 0,

                            prodset_id,
                            variant_id,

                            variant_header: "Custom",
                            tl: efhomeview_tls_new_variant_custom(),
                            variant_description: "Custom variant created by user",
                        },
                    })]
                }))

                props.variant_select({
                    kind: EFHomeView_Selection_Kind.Selection,
                    id: variant_id
                })
            }}
        >
            <div className={st.card_variant__layout}>
                <EPCardImg_Headln className={cl(st.card_variant__head, st.card_variant__item)}>
                    <div className={st.card_variant__title}>
                        {lang_prop(props.variant, i18n.language, "header")}
                    </div>

                    <div className={st.card_variant__price}>
                        {price} {t("currency.uah")}
                    </div>
                </EPCardImg_Headln>

                <div className={cl(st.card_variant__prods, st.card_variant__item)}>
                    <rfl.CmpLoop data={props.variant.prodset.products}>
                        {product => {
                            const img_src = imgref_data_apiurl(product.template.refimgs[0] ?? null)

                            return <EPCardImg_View key={product.id} className={st.card_variant__prod}>
                                <EPCardImg_LayerFView className={st.card_variant__prod__layer}>
                                    <EPCardImg_LayoutMainCol>
                                        <EPCardImg_ImgView {...img_src} sizes={`30vw`} />
                                    </EPCardImg_LayoutMainCol>
                                </EPCardImg_LayerFView>
                            </EPCardImg_View>
                        }}
                    </rfl.CmpLoop>
                </div>
            </div>
        </EPCardImg_LayerFButton>
    </EPCardImg_View>

}

export type ELHomeView__SecVariant_NewCustom_Head_Props = {
}

export const ELHomeView_SecVariant_NewCustom_Head: r.FC<ELHomeView__SecVariant_NewCustom_Head_Props> = props => {
    const { t } = ri18.useTranslation()

    return <div className={st.sec_view__head_newcustom}>
        <h1 className={st.sec_view__head_newcustom__title} >
            {t("item.header_chose_base_variant")}
        </h1>
    </div>
}

export type ELHomeView__SecVariant_NewCustom_Grid_Props = {
    readonly variants_public: readonly Data_Variant[]
    readonly variant_select: FnSetterStateles<EFHomeView_Selection>
}

export const ELHomeView_SecVariant_NewCustom_Grid: r.FC<ELHomeView__SecVariant_NewCustom_Grid_Props> = props => {
    return <div className={st.sec_view__grid_newcustom}>
        <rfl.CmpLoop data={props.variants_public}>
            {variant => {
                return <EL_CardVariant
                    key={variant.id}
                    variant={variant}
                    variant_select={props.variant_select}
                />
            }}
        </rfl.CmpLoop>
    </div>
}
