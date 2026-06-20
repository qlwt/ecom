import * as dbdef from "@fst/db-default"
import * as gs from "@fst/gstate"
import { rem } from "@fst/gstate"
import * as asr from "@qyu/atom-state-react"
import * as ddn from "@qyu/reactcmp-dropdown"
import * as rfl from "@qyu/reactcmp-flow-control"
import EPCardImg_IconView from "@src/client/component/primitive/card-img/element/icon_view"
import EPCardImg_ImgView from "@src/client/component/primitive/card-img/element/img_view"
import EPCardImg_LayerFButton from "@src/client/component/primitive/card-img/element/layerf_button"
import EPCardImg_LayoutMainCol from "@src/client/component/primitive/card-img/element/layout_maincol"
import EPCardImg_View from "@src/client/component/primitive/card-img/element/view"
import st_mat from "@src/client/component/primitive/product/style/argview_mat.module.scss"
import st from "@src/client/component/primitive/product/style/core.module.scss"
import EPSelectList_Material from "@src/client/component/primitive/selectlist/element/material"
import { domroot_dropdown } from "@src/client/const/domroot"
import { useRefO } from "@src/client/hook/ref/o"
import { imgref_data_apiurl } from "@src/client/util/imgref/data/apiurl"
import * as r from "react"
import { v7 as uuid } from "uuid"

export type ELProduct__ArgViewMat_Props = {
    readonly include_hidden: 0 | 1
    readonly include_private: 1 | 0

    readonly lang: string | null
    readonly lang_fallback: string | undefined

    readonly product_id: string
    readonly product_owner: string | null

    readonly arg_mat: gs.Rem_JoinData<"tmplpr_arg_mat">
    readonly imp_mat: gs.Rem_JoinData<"product_argmat"> | null

    readonly hook_action: (() => boolean) | null
}

export const ELProduct_ArgViewMat: r.FC<ELProduct__ArgViewMat_Props> = props => {
    const dispatch = asr.useAtomDispatch()
    const imp_id = r.useMemo(() => props.imp_mat?.id ?? uuid(), [props.imp_mat?.id])

    const ref_card = r.useRef<HTMLDivElement | null>(null)
    const refo_card = useRefO(ref_card)

    const [open, open_set] = r.useState(false)

    return <ddn.CmpContainerVirtual open={open} open_set={open_set}>
        <ddn.CmpButtonVirtual target={refo_card}>
            <EPCardImg_View ref={ref_card} key={props.arg_mat.id} className={st.info__material}>
                <EPCardImg_LayerFButton
                    event_click={() => {
                        if (props.hook_action?.() !== false) {
                            open_set(o => !o)
                        }
                    }}
                >
                    <EPCardImg_LayoutMainCol>
                        <rfl.CmpRequire
                            value={[props.imp_mat?.value] as const}

                            fallback={() => {
                                return <EPCardImg_IconView icon={`image`} />
                            }}
                        >
                            {([material_data]) => {
                                return <EPCardImg_ImgView
                                    key={material_data.id}

                                    {...imgref_data_apiurl(material_data.refimgs[0] ?? null)}
                                    sizes={`10vw`}
                                />
                            }}
                        </rfl.CmpRequire>
                    </EPCardImg_LayoutMainCol>
                </EPCardImg_LayerFButton>
            </EPCardImg_View>
        </ddn.CmpButtonVirtual>

        <ddn.CmpListPortal gap={5} portal={domroot_dropdown} align={`center`}>
            <ddn.CmpContent className={st_mat.list}>
                <EPSelectList_Material
                    include_hidden={props.include_hidden}
                    include_private={props.include_private}
                    state_selected_new={id => props.imp_mat?.value?.id === id}
                    templates={props.arg_mat.perms.map(perm => perm.template)}

                    event_select={id => {
                        if (props.hook_action?.() !== false) {
                            dispatch(rem.product_argmat.act.upsert({
                                patch: {
                                    body: {
                                        id: imp_id,

                                        patch: {
                                            value: id[0]!,
                                        },
                                    },
                                },

                                post_new: () => ({
                                    body: [{
                                        core: {
                                            ...dbdef.table.product_argmat,

                                            id: imp_id,
                                            value: id[0]!,
                                            owner: props.product_owner,
                                            product__id: props.product_id,
                                            tmplpr_arg_mat__id: props.arg_mat.id,
                                        },

                                        joins: {},
                                    }],
                                }),
                            }))

                            open_set(false)
                        }
                    }}
                />
            </ddn.CmpContent>
        </ddn.CmpListPortal>
    </ddn.CmpContainerVirtual>
}
