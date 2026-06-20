import * as cc from "@fst/config/client"
import { rem } from "@fst/gstate"
import * as asr from "@qyu/atom-state-react"
import EPAction_BtnClick from "@src/client/component/primitive/action/element/btn_click"
import EPAction_BtnToggle from "@src/client/component/primitive/action/element/btn_toggle"
import EPCardImg_ImgLink from "@src/client/component/primitive/card-img/element/img_link"
import EPCardImg_LayerBActions from "@src/client/component/primitive/card-img/element/layerb_actions"
import EPCardImg_LayerFView from "@src/client/component/primitive/card-img/element/layerf_view"
import EPCardImg_LayoutInfo from "@src/client/component/primitive/card-img/element/layout_info"
import EPCardImg_LayoutMainCol from "@src/client/component/primitive/card-img/element/layout_maincol"
import EPCardImg_Tagln from "@src/client/component/primitive/card-img/element/tagln"
import EPCardImg_View from "@src/client/component/primitive/card-img/element/view"
import { urlmap } from "@src/client/urlmap"
import { imgref_data_apiurl } from "@src/client/util/imgref/data/apiurl"
import { imgref_data_top } from "@src/client/util/imgref/data/top"
import { tag_refnode_normalize } from "@src/client/util/tag/refnode/normalize"
import * as r from "react"

export type ELCon__CardMaterial_Mtops = Readonly<{
    readonly node: cc.RemDef["material"]["joins"]["core"]
}>

export const ELCon_CardMaterial: r.FC<ELCon__CardMaterial_Mtops> = props => {
    const img_srcdef = imgref_data_apiurl(imgref_data_top(props.node.refimgs))
    const href = urlmap.console.edit_material({ id: props.node.id })
    const tags = tag_refnode_normalize(props.node.reftags)
    const dispatch = asr.useAtomDispatch()

    return <EPCardImg_View>
        <EPCardImg_LayerBActions justify={`start`}>
            <EPAction_BtnClick
                style_root
                style_redclr
                icon={`trashcan`}

                event_click={() => {
                    dispatch(rem.material.act.delete({
                        body: {
                            ids: [props.node.id],
                        },
                    }))
                }}
            />

            <EPAction_BtnToggle
                style_root
                icon={`eye_slash`}

                state_active={props.node.status_hidden === 1}

                event_click={() => {
                    dispatch(rem.material.act.patch({
                        body: {
                            id: props.node.id,

                            patch: {
                                status_hidden: Number(!props.node.status_hidden) as 0 | 1,
                            }
                        },
                    }))
                }}
            />

            <EPAction_BtnToggle
                style_root
                icon={`fatarrow-bottom`}

                state_active={props.node.status_available === 0}

                event_click={() => {
                    dispatch(rem.material.act.patch({
                        body: {
                            id: props.node.id,

                            patch: {
                                status_hidden: Number(!props.node.status_hidden) as 0 | 1,
                            },
                        },
                    }))
                }}
            />
        </EPCardImg_LayerBActions>

        <EPCardImg_LayerFView>
            <EPCardImg_LayoutMainCol>
                <EPCardImg_ImgLink href={href} {...img_srcdef} sizes={`50vw`} />

                <EPCardImg_LayoutInfo>
                    <EPCardImg_Tagln
                        view_src={tags}
                        view_length={3}
                    />
                </EPCardImg_LayoutInfo>
            </EPCardImg_LayoutMainCol>
        </EPCardImg_LayerFView>
    </EPCardImg_View>
}
