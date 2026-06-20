import * as gs from "@fst/gstate"
import type { FnSetterStateles } from "@qyu/reactcmp-dropdown"
import * as rfl from "@qyu/reactcmp-flow-control"
import EPCardImg_Headln from "@src/client/component/primitive/card-img/element/headln"
import EPCardImg_Headln_Title from "@src/client/component/primitive/card-img/element/headln__title"
import EPCardImg_ImgView from "@src/client/component/primitive/card-img/element/img_view"
import EPCardImg_LayerFButton from "@src/client/component/primitive/card-img/element/layerf_button"
import EPCardImg_LayoutInfo from "@src/client/component/primitive/card-img/element/layout_info"
import EPCardImg_LayoutMainCol from "@src/client/component/primitive/card-img/element/layout_maincol"
import EPCardImg_View from "@src/client/component/primitive/card-img/element/view"
import { imgref_data_apiurl } from "@src/client/util/imgref/data/apiurl"
import { lang_prop } from "@src/client/util/tl/prop"
import * as r from "react"
import * as ri18 from "react-i18next"

export type ELHome_CardTmplIt_Props = {
    readonly node: gs.Rem_JoinData<"tmplit">

    readonly state_selected: boolean
    readonly state_selected_set: FnSetterStateles<string>
}

export const ELHome_CardTmplIt: r.FC<ELHome_CardTmplIt_Props> = props => {
    const { i18n } = ri18.useTranslation()

    const img_srcdef = imgref_data_apiurl(props.node.refimgs[0] ?? null)
    const header = lang_prop(props.node, i18n.language, "name").trim()

    return <EPCardImg_View>
        <EPCardImg_LayerFButton
            state_disabled={props.state_selected}

            event_click={() => {
                props.state_selected_set(props.node.id)
            }}
        >
            <EPCardImg_LayoutMainCol>
                <EPCardImg_ImgView {...img_srcdef} sizes={`30vw`} />

                <rfl.CmpIf value={Boolean(header)}>
                    {() => <EPCardImg_LayoutInfo>
                        <EPCardImg_Headln>
                            <EPCardImg_Headln_Title>
                                {header}
                            </EPCardImg_Headln_Title>
                        </EPCardImg_Headln>
                    </EPCardImg_LayoutInfo>}
                </rfl.CmpIf>
            </EPCardImg_LayoutMainCol>
        </EPCardImg_LayerFButton>
    </EPCardImg_View>
}

export default ELHome_CardTmplIt
