import * as rfl from "@qyu/reactcmp-flow-control"
import st from "@src/client/component/feature/console-edit/style/sec_img.module.scss"
import EPAction_BtnClick from "@src/client/component/primitive/action/element/btn_click"
import EPCardImg_IconFile from "@src/client/component/primitive/card-img/element/icon_file"
import EPCardImg_IconView from "@src/client/component/primitive/card-img/element/icon_view"
import EPCardImg_ImgView from "@src/client/component/primitive/card-img/element/img_view"
import EPCardImg_LayerBActions from "@src/client/component/primitive/card-img/element/layerb_actions"
import EPCardImg_LayerFButton from "@src/client/component/primitive/card-img/element/layerf_button"
import EPCardImg_LayerFView from "@src/client/component/primitive/card-img/element/layerf_view"
import EPCardImg_LayoutMainCol from "@src/client/component/primitive/card-img/element/layout_maincol"
import EPCardImg_View from "@src/client/component/primitive/card-img/element/view"
import type { Icon_Shortcut } from "@src/client/util/icon/type/shortcut"
import type { ImgSrcDef } from "@src/client/util/img/type/node"
import type { ImgRefNode_Data } from "@src/client/util/imgref/type/node"
import * as r from "react"

type Selection = (
    | {
        readonly kind: "id"
        readonly value: string
    }
    | {
        readonly kind: "action:post"
    }
)

type EL__NavItem_Props = {
    readonly img_id: string
    readonly img_srcdef: ImgSrcDef

    readonly state_active: boolean

    readonly selection_set: (value: Selection) => void
}

const EL_NavItem: r.FC<EL__NavItem_Props> = props => {
    return <EPCardImg_View className={st.nav__item}>
        <EPCardImg_LayerFButton
            style_shadow_type={`none`}
            state_disabled={props.state_active}

            event_click={() => {
                props.selection_set({ kind: "id", value: props.img_id })
            }}
        >
            <EPCardImg_LayoutMainCol>
                <EPCardImg_ImgView {...props.img_srcdef} sizes={"10vw"} />
            </EPCardImg_LayoutMainCol>
        </EPCardImg_LayerFButton>
    </EPCardImg_View>
}

type EL__NavAction_Props = {
    readonly icon: Icon_Shortcut

    readonly state_active: boolean

    readonly selection_set: (selection: Selection) => void
}

const EL_NavAction: r.FC<EL__NavAction_Props> = props => {
    return <EPCardImg_View>
        <EPCardImg_LayerFButton
            className={st.nav__item}
            style_shadow_type={`none`}
            state_disabled={props.state_active}

            event_click={() => {
                props.selection_set({ kind: "action:post" })
            }}
        >
            <EPCardImg_LayoutMainCol>
                <EPCardImg_IconView icon={props.icon} />
            </EPCardImg_LayoutMainCol>
        </EPCardImg_LayerFButton>
    </EPCardImg_View>
}

type EL__Preview_Props = {
    readonly img: ImgRefNode_Data | null
    readonly img_post: (image: File) => void
    readonly img_delete: (data: ImgRefNode_Data) => void
    readonly img_srcdef_new: (data: ImgRefNode_Data) => ImgSrcDef
}

const EL_Preview: r.FC<EL__Preview_Props> = props => {
    return <EPCardImg_View className={st.preivew__card}>
        <rfl.CmpRequire
            value={[props.img] as const}

            fallback={() => {
                return <EPCardImg_LayerFView>
                    <EPCardImg_LayoutMainCol>
                        <EPCardImg_IconFile
                            multiple={true}
                            accept={`image/*`}
                            className={st.preview}
                            className_drag={st.preview_drag}
                            icon={`arrow-toupright-insquare`}

                            event_upload={files => {
                                const images = files.filter(f => f.type.startsWith("image/"))

                                images.forEach(async image => {
                                    props.img_post(image)
                                })
                            }}
                        />
                    </EPCardImg_LayoutMainCol>
                </EPCardImg_LayerFView>
            }}
        >
            {([img_data]) => {
                const img_srcdef = props.img_srcdef_new(img_data)

                return <>
                    <EPCardImg_LayerFView>
                        <EPCardImg_LayoutMainCol className={st.preview}>
                            <EPCardImg_ImgView {...img_srcdef} sizes={`10vw`} />
                        </EPCardImg_LayoutMainCol>
                    </EPCardImg_LayerFView>

                    <EPCardImg_LayerBActions justify={`start`}>
                        <EPAction_BtnClick
                            style_root
                            style_redclr

                            icon={`trashcan`}

                            event_click={() => {
                                props.img_delete(img_data)
                            }}
                        />
                    </EPCardImg_LayerBActions>
                </>
            }}
        </rfl.CmpRequire>
    </EPCardImg_View>
}

export type ELConEdit__SecImg_Props = {
    readonly imgs: readonly ImgRefNode_Data[]
    readonly img_post: (file: File) => void
    readonly img_delete: (data: ImgRefNode_Data) => void
    readonly img_srcdef_new: (data: ImgRefNode_Data) => ImgSrcDef
}

export const ELConEdit_SecImg: r.FC<ELConEdit__SecImg_Props> = props => {
    const ref_lastindex = r.useRef<number | null>(null)

    const [selection, selection_set] = r.useState<Selection>(() => {
        if (props.imgs.length) {
            ref_lastindex.current = 0

            return {
                value: props.imgs[0]!.id,
                kind: "id" as const,
            }
        }

        return { kind: "action:post" as const }
    })

    const selection_active = r.useMemo(() => {
        if (selection.kind === "id") {
            if (ref_lastindex.current !== null) {
                const img = props.imgs[ref_lastindex.current]

                if (img && img.id === selection.value) {
                    return img
                }
            }

            for (let i = 0; i < props.imgs.length; ++i) {
                const img = props.imgs[i]!

                if (img.id === selection.value) {
                    ref_lastindex.current = i

                    return img
                }
            }
        }

        return null
    }, [selection, props.imgs])

    r.useLayoutEffect(() => {
        if (selection.kind === "id") {
            if (ref_lastindex.current !== null) {
                const img = props.imgs[ref_lastindex.current]

                if (img && img.id === selection.value) {
                    return
                }
            }

            for (let i = 0; i < props.imgs.length; ++i) {
                const img = props.imgs[i]!

                if (img.id === selection.value) {
                    ref_lastindex.current = i

                    return
                }
            }

            selection_set({ kind: "action:post" })
        }
    }, [props.imgs])

    return <div className={st.root}>
        <nav className={st.nav}>
            <rfl.CmpLoop data={props.imgs}>
                {img => {
                    return <EL_NavItem
                        key={`item:${img.id}`}

                        img_id={img.id}
                        img_srcdef={props.img_srcdef_new(img)}

                        selection_set={selection_set}

                        state_active={selection_active?.id === img.id}
                    />
                }}
            </rfl.CmpLoop>

            <EL_NavAction
                icon={`arrow-toupright-insquare`}

                state_active={selection.kind === "action:post"}

                selection_set={selection_set}
            />
        </nav>

        <EL_Preview
            img={selection_active}

            img_post={props.img_post}
            img_delete={props.img_delete}
            img_srcdef_new={props.img_srcdef_new}
        />
    </div>
}

export default ELConEdit_SecImg
