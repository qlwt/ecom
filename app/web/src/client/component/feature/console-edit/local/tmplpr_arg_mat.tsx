import * as cc from "@fst/config/client"
import { rem } from "@fst/gstate"
import * as asr from "@qyu/atom-state-react"
import * as rddn from "@qyu/reactcmp-dropdown"
import * as rfl from "@qyu/reactcmp-flow-control"
import st from "@src/client/component/feature/console-edit/style/tmplpr_arg_mat.module.scss"
import EPCardImg_Headln from "@src/client/component/primitive/card-img/element/headln"
import EPCardImg_Headln_Title from "@src/client/component/primitive/card-img/element/headln__title"
import EPCardImg_IconView from "@src/client/component/primitive/card-img/element/icon_view"
import EPCardImg_ImgView from "@src/client/component/primitive/card-img/element/img_view"
import EPCardImg_LayerFButton from "@src/client/component/primitive/card-img/element/layerf_button"
import EPCardImg_LayoutInfo from "@src/client/component/primitive/card-img/element/layout_info"
import EPCardImg_LayoutMainCol from "@src/client/component/primitive/card-img/element/layout_maincol"
import EPCardImg_View from "@src/client/component/primitive/card-img/element/view"
import EPSelectList_TmplMt from "@src/client/component/primitive/selectlist/element/tmplmt"
import { domroot_dropdown } from "@src/client/const/domroot"
import { imgref_data_apiurl } from "@src/client/util/imgref/data/apiurl"
import { imgref_data_top } from "@src/client/util/imgref/data/top"
import { lang_prop } from "@src/client/util/tl/prop"
import cl from "classnames"
import * as r from "react"
import { v7 as uuid } from "uuid"

type EL__Card_Props = {
    readonly lang: string | null
    readonly node: cc.RemDef["tmplpr_arg_mat_perm"]["joins"]["core"]
}

const EL_Card: r.FC<EL__Card_Props> = props => {
    const tmplmt = props.node.template
    const dispatch = asr.useAtomDispatch()

    const header = lang_prop(tmplmt, props.lang, "name", "").trim()
    const img_src = imgref_data_apiurl(imgref_data_top(tmplmt.refimgs))

    return <EPCardImg_View className={st.card}>
        <EPCardImg_LayerFButton
            event_click={() => {
                dispatch(rem.tmplpr_arg_mat_perm.act.delete({
                    body: {
                        ids: [props.node.id]
                    }
                }))
            }}
        >
            <EPCardImg_LayoutMainCol>
                <EPCardImg_ImgView {...img_src} sizes={`30vw`} />

                <EPCardImg_LayoutInfo>
                    <EPCardImg_Headln style_center>
                        <EPCardImg_Headln_Title state_placeholder={header === ""}>
                            {header || "No Title"}
                        </EPCardImg_Headln_Title>
                    </EPCardImg_Headln>
                </EPCardImg_LayoutInfo>
            </EPCardImg_LayoutMainCol>
        </EPCardImg_LayerFButton>
    </EPCardImg_View>
}

export type ELConEdit__TmplPrArgMat_Props = {
    readonly lang: string | null
    readonly node: cc.RemDef["tmplpr_arg_mat"]["joins"]["core"]

    readonly stmod: Readonly<Record<"line", "string">>
}

export const ELConEdit_TmplPrArgMat: r.FC<ELConEdit__TmplPrArgMat_Props> = props => {
    const dispatch = asr.useAtomDispatch()
    const [post_open, post_open_set] = r.useState(false)

    const ref_btn = r.useRef<HTMLButtonElement | null>(null)

    return <div className={cl(props.stmod.line, st.root)}>
        <rddn.CmpContainerVirtual
            open={post_open}
            open_set={post_open_set}
        >
            <EPCardImg_View className={st.card_post}>
                <rddn.CmpButtonVirtual target={() => ref_btn.current}>
                    <EPCardImg_LayerFButton ref={ref_btn} event_click={post_open_set.bind(null, b => !b)}>
                        <EPCardImg_LayoutMainCol>
                            <EPCardImg_IconView icon={"post"} />
                        </EPCardImg_LayoutMainCol>
                    </EPCardImg_LayerFButton>
                </rddn.CmpButtonVirtual>
            </EPCardImg_View>

            <rddn.CmpListPortal portal={domroot_dropdown} gap={5} align="center" justify>
                <rddn.CmpContent className={st.ddn__content}>
                    <EPSelectList_TmplMt
                        include_hidden={1}
                        include_private={1}

                        state_selected_new={id => {
                            return props.node?.perms.some(perm => {
                                return perm.tmplmt__id === id
                            }) || false
                        }}

                        event_select={ids => {
                            post_open_set(false)

                            const node = props.node

                            dispatch(rem.tmplpr_arg_mat_perm.act.post({
                                body: ids.map(tmplmt_id => ({
                                    core: {
                                        id: uuid(),

                                        tmplmt__id: tmplmt_id,
                                        tmplpr_arg_mat__id: node.id,
                                    },

                                    joins: {},
                                }))
                            }))
                        }}
                    />
                </rddn.CmpContent>
            </rddn.CmpListPortal>
        </rddn.CmpContainerVirtual>

        <rfl.CmpLoop data={props.node.perms}>
            {perm => {
                return <EL_Card
                    key={perm.id}

                    node={perm}
                    lang={props.lang}
                />
            }}
        </rfl.CmpLoop>
    </div>
}

export default ELConEdit_TmplPrArgMat
