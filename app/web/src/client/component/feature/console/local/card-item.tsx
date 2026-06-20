import * as cc from "@fst/config/client"
import * as cst from "@fst/cst"
import * as gs from "@fst/gstate"
import { rem } from "@fst/gstate"
import * as asr from "@qyu/atom-state-react"
import * as rfl from "@qyu/reactcmp-flow-control"
import ELCon_ModalCloneItem from "@src/client/component/feature/console/local/modal-cloneitem"
import EPAction_BtnClick from "@src/client/component/primitive/action/element/btn_click"
import EPAction_BtnToggle from "@src/client/component/primitive/action/element/btn_toggle"
import EPCardImg_Headln from "@src/client/component/primitive/card-img/element/headln"
import EPCardImg_Headln_Link from "@src/client/component/primitive/card-img/element/headln__link"
import EPCardImg_Headln_Title from "@src/client/component/primitive/card-img/element/headln__title"
import EPCardImg_ImgLink from "@src/client/component/primitive/card-img/element/img_link"
import EPCardImg_LayerBActions from "@src/client/component/primitive/card-img/element/layerb_actions"
import EPCardImg_LayerFView from "@src/client/component/primitive/card-img/element/layerf_view"
import EPCardImg_LayoutInfo from "@src/client/component/primitive/card-img/element/layout_info"
import EPCardImg_LayoutMainCol from "@src/client/component/primitive/card-img/element/layout_maincol"
import EPCardImg_LayoutVarCol from "@src/client/component/primitive/card-img/element/layout_varcol"
import EPCardImg_Tagln from "@src/client/component/primitive/card-img/element/tagln"
import EPCardImg_VarCol__View from "@src/client/component/primitive/card-img/element/var_view"
import EPCardImg_View from "@src/client/component/primitive/card-img/element/view"
import { urlmap } from "@src/client/urlmap"
import { imgref_data_apiurl } from "@src/client/util/imgref/data/apiurl"
import { imgref_data_top } from "@src/client/util/imgref/data/top"
import { tag_refnode_normalize } from "@src/client/util/tag/refnode/normalize"
import { lang_prop } from "@src/client/util/tl/prop"
import * as r from "react"
import * as ri18 from "react-i18next"

export type ELCon__CardItem_Mtops = Readonly<{
    readonly node: cc.RemDef["item"]["joins"]["core"]

    readonly event_addnode?: (node: gs.Rem_Node<"item">) => void
}>

export const ELCon_CardItem: r.FC<ELCon__CardItem_Mtops> = props => {
    const { t, i18n } = ri18.useTranslation()
    const dispatch = asr.useAtomDispatch()

    const tags = tag_refnode_normalize(props.node.reftags)
    const href = urlmap.console.edit_item({ id: props.node.id })
    const img_srcdef = imgref_data_apiurl(imgref_data_top(props.node.refimgs))
    const item_header = lang_prop(props.node, i18n.language, "name", "")

    const [modal_clone_open, modal_clone_open_set] = r.useState(false)

    const variants_public = r.useMemo(() => {
        return props.node.variants.filter(variant => {
            return !variant.owner
        })
    }, [props.node.variants])

    const status_error = r.useMemo(() => {
        for (const variant of variants_public) {
            for (const product of variant.prodset.products) {
                for (const arg of product.template.args) {
                    const argmat = arg.defs_mat[0]

                    if (arg.kind === cst.TmplPrArg_Kind.Mat && argmat) {
                        const imp = product.argimps_mat.find(imp => imp.tmplpr_arg_mat__id === argmat.id)

                        if (
                            !imp
                            || !imp.value
                            || !imp.value.status_available
                            || imp.value.status_hidden
                            || imp.value.template.status_hidden
                        ) {
                            return true
                        }
                    }
                }
            }
        }

        return false
    }, [variants_public])

    return <EPCardImg_View>
        <ELCon_ModalCloneItem
            src_node={props.node}

            open={modal_clone_open}
            open_set={modal_clone_open_set}

            event_addnode={props.event_addnode}
        />

        <EPCardImg_LayerBActions justify={`start`}>
            <EPAction_BtnClick
                style_root
                style_redclr
                icon={`trashcan`}

                event_click={() => {
                    dispatch(rem.item.act.delete({
                        body: {
                            ids: [props.node.id]
                        },
                    }))
                }}
            />

            <EPAction_BtnToggle
                style_root
                icon={`eye_slash`}

                state_active={props.node.status_hidden === 1}

                event_click={() => {
                    dispatch(rem.item.act.patch({
                        body: {
                            id: props.node.id,

                            patch: {
                                status_hidden: Number(!props.node.status_hidden) as 0 | 1,
                            },
                        },
                    }))
                }}
            />

            <EPAction_BtnToggle
                style_root
                icon={`copy`}
                state_active={modal_clone_open}

                event_click={() => {
                    modal_clone_open_set(b => !b)
                }}
            />
        </EPCardImg_LayerBActions>

        <EPCardImg_LayerFView state_error={status_error}>
            <EPCardImg_LayoutMainCol>
                <EPCardImg_ImgLink href={href} {...img_srcdef} sizes={`50vw`} />

                <EPCardImg_LayoutInfo>
                    <EPCardImg_Tagln
                        view_src={tags}
                        view_length={3}
                    />

                    <EPCardImg_Headln>
                        <EPCardImg_Headln_Title state_placeholder={item_header === ""}>
                            {item_header || t("commons.noname")}
                        </EPCardImg_Headln_Title>

                        <EPCardImg_Headln_Link href={href}>
                            {t(`commons.edit`)}
                        </EPCardImg_Headln_Link>
                    </EPCardImg_Headln>
                </EPCardImg_LayoutInfo>
            </EPCardImg_LayoutMainCol>

            <EPCardImg_LayoutVarCol>
                <rfl.CmpLoop data={props.node.variants.filter(variant => !variant.owner)}>
                    {variant => {
                        const header = lang_prop(variant, i18n.language, "header", "").trim()

                        return <EPCardImg_VarCol__View
                            key={variant.id}

                            text={header || t("commons.noname")}
                            status_placeholder={header.length === 0}
                        />
                    }}
                </rfl.CmpLoop>
            </EPCardImg_LayoutVarCol>
        </EPCardImg_LayerFView>
    </EPCardImg_View>
}
