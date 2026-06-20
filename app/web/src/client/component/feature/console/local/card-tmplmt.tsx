import * as cc from "@fst/config/client"
import { rem } from "@fst/gstate"
import * as asr from "@qyu/atom-state-react"
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
import EPCardImg_View from "@src/client/component/primitive/card-img/element/view"
import { urlmap } from "@src/client/urlmap"
import { imgref_data_apiurl } from "@src/client/util/imgref/data/apiurl"
import { imgref_data_top } from "@src/client/util/imgref/data/top"
import { lang_prop } from "@src/client/util/tl/prop"
import * as r from "react"
import * as ri18 from "react-i18next"

export type ELCon__CardTmplMt_Mtops = Readonly<{
    readonly node: cc.RemDef["tmplmt"]["joins"]["core"]
}>

export const ELCon_CardTmplMt: r.FC<ELCon__CardTmplMt_Mtops> = props => {
    const { t, i18n } = ri18.useTranslation()

    const header = lang_prop(props.node, i18n.language, "name", "").trim()
    const img_srcdef = imgref_data_apiurl(imgref_data_top(props.node.refimgs))
    const href = urlmap.console.edit_tmplmt({ id: props.node.id })
    const dispatch = asr.useAtomDispatch()

    return <EPCardImg_View>
        <EPCardImg_LayerBActions justify={`start`}>
            <EPAction_BtnClick
                style_root
                style_redclr
                icon={`trashcan`}

                event_click={() => {
                    dispatch(rem.tmplmt.act.delete({
                        body: {
                            ids: [props.node.id]
                        }
                    }))
                }}
            />

            <EPAction_BtnToggle
                style_root
                icon={`eye_slash`}

                state_active={props.node.status_hidden === 1}

                event_click={() => {
                    dispatch(rem.tmplmt.act.patch({
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
                    <EPCardImg_Headln>
                        <EPCardImg_Headln_Title state_placeholder={header === ""}>
                            {header || t(`commons.noname`)}
                        </EPCardImg_Headln_Title>

                        <EPCardImg_Headln_Link href={href}>
                            <span>
                                {t(`commons.edit`)}
                            </span>
                        </EPCardImg_Headln_Link>
                    </EPCardImg_Headln>
                </EPCardImg_LayoutInfo>
            </EPCardImg_LayoutMainCol>
        </EPCardImg_LayerFView>
    </EPCardImg_View>
}
