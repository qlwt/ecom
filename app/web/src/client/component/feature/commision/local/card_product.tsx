import st from "@client/component/feature/commision/style/card_product.module.scss"
import * as cc from "@fst/config/client"
import * as sxm from "@fst/syntax-math"
import * as rfl from "@qyu/reactcmp-flow-control"
import * as sx from "@qyu/syntax-core"
import EPCardImg_ImgView from "@src/client/component/primitive/card-img/element/img_view"
import EPCardImg_LayerFView from "@src/client/component/primitive/card-img/element/layerf_view"
import EPCardImg_LayoutMainCol from "@src/client/component/primitive/card-img/element/layout_maincol"
import EPCardImg_View from "@src/client/component/primitive/card-img/element/view"
import { formula_hidden_new_commision_arg } from "@src/client/util/formula_hidden/commision_arg"
import { imgref_data_apiurl } from "@src/client/util/imgref/data/apiurl"
import { lang_prop } from "@src/client/util/tl/prop"
import cl from "classnames"
import * as r from "react"
import * as ri18 from "react-i18next"

export type ELCommision__CardProduct_Props = {
    readonly status_hideerror: boolean

    readonly node: cc.RemDef["commision_product"]["joins"]["core"]
}

export const ELCommision_CardProduct: r.FC<ELCommision__CardProduct_Props> = props => {
    const { i18n } = ri18.useTranslation()
    const cache_expr = r.useMemo(() => new Map<string, sx.Tree_Slot<sxm.TreeNode>>(), [])

    const img_srcdef = imgref_data_apiurl(props.node.refimgs[0] ?? null)

    const arg_hidden = r.useCallback((formula_raw: string) => {
        return formula_hidden_new_commision_arg({
            formula_raw: formula_raw,
            product: props.node,
            cache_expr,
        })
    }, [props.node, cache_expr])

    return <EPCardImg_View>
        <EPCardImg_LayerFView>
            <EPCardImg_LayoutMainCol className={st.maincol}>
                <div className={st.info_topleft}>
                    <div className={st.info__box}>
                        {props.node.quantity}
                    </div>
                </div>

                <div className={st.info_bottom}>
                    <div className={cl(st.info__box, st._name)}>
                        {lang_prop(props.node, i18n.language, "tmplpr_name")}
                    </div>
                </div>

                <EPCardImg_ImgView {...img_srcdef} sizes={`30vw`} />
            </EPCardImg_LayoutMainCol>

            <div className={st.argcol}>
                <rfl.CmpLoop data={props.node.args_mat}>
                    {cnode => {
                        if (arg_hidden(cnode.hidden_formula)) {
                            return null
                        }

                        const img_srcdef = imgref_data_apiurl(cnode.refimgs[0] ?? null)

                        return <EPCardImg_View key={cnode.id} className={st.argcol__item}>
                            <EPCardImg_LayerFView
                                style_shadow_size={`small`}
                                state_error={cnode.material === undefined && !props.status_hideerror}
                            >
                                <EPCardImg_ImgView {...img_srcdef} sizes={`10vw`} />
                            </EPCardImg_LayerFView>
                        </EPCardImg_View>
                    }}
                </rfl.CmpLoop>

                <rfl.CmpLoop data={props.node.args_bool}>
                    {cnode => {
                        if (arg_hidden(cnode.hidden_formula)) {
                            return null
                        }

                        const cnode_title_true = lang_prop(cnode, i18n.language, "title_true")
                        const cnode_title_false = lang_prop(cnode, i18n.language, "title_false")

                        return <EPCardImg_View key={cnode.id} className={st.argcol__item}>
                            <EPCardImg_LayerFView style_shadow_size={`small`}>
                                <EPCardImg_LayoutMainCol className={st.argcol__bool}>
                                    <span>
                                        {cnode.value ? cnode_title_true : cnode_title_false}
                                    </span>
                                </EPCardImg_LayoutMainCol>
                            </EPCardImg_LayerFView>
                        </EPCardImg_View>
                    }}
                </rfl.CmpLoop>

                <rfl.CmpLoop data={props.node.args_line}>
                    {cnode => {
                        if (arg_hidden(cnode.hidden_formula)) {
                            return null
                        }

                        const cnode_name = lang_prop(cnode, i18n.language, "name")

                        return <EPCardImg_View key={cnode.id} className={st.argcol__item}>
                            <EPCardImg_LayerFView style_shadow_size={`small`}>
                                <EPCardImg_LayoutMainCol className={st.argcol__int}>
                                    <span>
                                        {cnode_name}
                                    </span>

                                    <span>
                                        {cnode.x_value}
                                    </span>
                                </EPCardImg_LayoutMainCol>
                            </EPCardImg_LayerFView>
                        </EPCardImg_View>
                    }}
                </rfl.CmpLoop>

                <rfl.CmpLoop data={props.node.args_rect}>
                    {cnode => {
                        if (arg_hidden(cnode.hidden_formula)) {
                            return null
                        }

                        const cnode_name = lang_prop(cnode, i18n.language, "name")

                        return <EPCardImg_View key={cnode.id} className={st.argcol__item}>
                            <EPCardImg_LayerFView style_shadow_size={`small`}>
                                <EPCardImg_LayoutMainCol className={st.argcol__rect}>
                                    <span>
                                        {cnode_name}
                                    </span>

                                    <span>
                                        {cnode.x_value}x{cnode.y_value}
                                    </span>
                                </EPCardImg_LayoutMainCol>
                            </EPCardImg_LayerFView>
                        </EPCardImg_View>
                    }}
                </rfl.CmpLoop>
            </div>
        </EPCardImg_LayerFView>
    </EPCardImg_View>
}

export default ELCommision_CardProduct
