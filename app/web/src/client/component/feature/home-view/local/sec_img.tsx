import st from "@client/component/feature/home-view/style/sec_img.module.scss"
import * as gs from "@fst/gstate"
import * as rfl from "@qyu/reactcmp-flow-control"
import EPCardImg_ImgView from "@src/client/component/primitive/card-img/element/img_view"
import EPCardImg_LayerFButton from "@src/client/component/primitive/card-img/element/layerf_button"
import EPCardImg_LayerFView from "@src/client/component/primitive/card-img/element/layerf_view"
import EPCardImg_LayoutMainCol from "@src/client/component/primitive/card-img/element/layout_maincol"
import EPCardImg_View from "@src/client/component/primitive/card-img/element/view"
import type { FnSetterStateful } from "@src/client/type/fns"
import { imgref_data_apiurl } from "@src/client/util/imgref/data/apiurl"
import * as r from "react"

type Data_Item = gs.Rem_JoinData<"item">
type Data_ItemRefImg = gs.Rem_JoinData<"item_refimg">

const useImgActive = function(node: Data_Item): [string | null, FnSetterStateful<string | null>, Data_ItemRefImg | null] {
    const ref_lastcheck = r.useRef<null | number>(null)

    const [selection, selection_set] = r.useState<null | string>(null)

    const img_active = r.useMemo(() => {
        if (selection === null) {
            return node.refimgs[0] ?? null
        }

        if (ref_lastcheck.current !== null) {
            const img = node.refimgs[ref_lastcheck.current]

            if (img && img.id === selection) {
                return img
            }
        }

        for (let i = 0; i < node.refimgs.length; ++i) {
            const img = node.refimgs[i]!

            if (img.id === selection) {
                return img
            }
        }

        return null
    }, [node.refimgs, selection])

    return [selection, selection_set, img_active]
}

export type ELHomeView__SecImg_Props = {
    readonly node: Data_Item
}

export const ELHomeView_SecImg: r.FC<ELHomeView__SecImg_Props> = props => {
    const [, img_sel_set, img_active] = useImgActive(props.node)

    return <section className={st.root}>
        <div className={st.sec_nav}>
            <rfl.CmpLoop data={props.node.refimgs}>
                {img => <EPCardImg_View key={img.id} className={st.cardview}>
                    <EPCardImg_LayerFButton
                        style_shadow_type={`none`}
                        state_disabled={img.id === img_active?.id}

                        event_click={() => {
                            img_sel_set(img.id)
                        }}
                    >
                        <EPCardImg_LayoutMainCol>
                            <EPCardImg_ImgView {...imgref_data_apiurl(img)} sizes={`30vw`} />
                        </EPCardImg_LayoutMainCol>
                    </EPCardImg_LayerFButton>
                </EPCardImg_View>}
            </rfl.CmpLoop>
        </div>

        <div className={st.sec_view}>
            <EPCardImg_View className={st.cardview}>
                <EPCardImg_LayerFView>
                    <EPCardImg_LayoutMainCol>
                        <EPCardImg_ImgView {...imgref_data_apiurl(img_active)} sizes={`90vw`} />
                    </EPCardImg_LayoutMainCol>
                </EPCardImg_LayerFView>
            </EPCardImg_View>
        </div>
    </section>
}

export default ELHomeView_SecImg
