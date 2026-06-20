import * as capi from "@fst/capi"
import * as cc from "@fst/config/client"
import * as dbdef from "@fst/db-default"
import { rem } from "@fst/gstate"
import * as asr from "@qyu/atom-state-react"
import * as rfl from "@qyu/reactcmp-flow-control"
import { ELConEdit_Mark } from "@src/client/component/feature/console-edit/local/mark"
import { ELConEdit_MarkInput } from "@src/client/component/feature/console-edit/local/mark_input"
import { ELConEdit_MarkList } from "@src/client/component/feature/console-edit/local/mark_list"
import st_slider from "@src/client/component/feature/console-edit/style/int_slider.module.scss"
import st from "@src/client/component/feature/console-edit/style/tmplpr_arg_rect.module.scss"
import EPAction_BtnClick from "@src/client/component/primitive/action/element/btn_click"
import EPInSlider_ViewSq from "@src/client/component/primitive/in-slider/element/view_square"
import { lang_prop } from "@src/client/util/tl/prop"
import cl from "classnames"
import * as r from "react"
import { v7 as uuid } from "uuid"

type EL__Marks_Props = {
    readonly node_id: string
    readonly lang: string | null
    readonly mark_list: readonly cc.RemDef["tmplpr_arg_rect_mark"]["joins"]["core"][]
}

const EL_Marks: r.FC<EL__Marks_Props> = props => {
    const dispatch = asr.useAtomDispatch()

    const mark_update = function(id: string, patch: capi.SendRest_DataPatch_Body<"tmplpr_arg_rect_mark">["patch"]) {
        dispatch(rem.tmplpr_arg_rect_mark.act.patch({
            body: {
                id,
                patch,
            },
        }))
    }

    const api = {
        delete: (id: string) => {
            dispatch(rem.tmplpr_arg_rect_mark.act.delete({
                body: { ids: [id] }
            }))
        },

        label_set: (id: string, label: string, tl: readonly cc.RemDef["tmplpr_arg_rect_mark_tl"]["joins"]["core"][]) => {
            if (props.lang === null) {
                mark_update(id, { label })
            } else {
                for (const tlnode of tl) {
                    if (tlnode.lang === props.lang) {
                        dispatch(rem.tmplpr_arg_rect_mark_tl.act.patch({
                            body: {
                                id: tlnode.id,

                                patch: {
                                    tltable: {
                                        label,
                                    },
                                },
                            },
                        }))

                        return
                    }
                }

                dispatch(rem.tmplpr_arg_rect_mark_tl.act.post({
                    body: [{
                        core: {
                            ...dbdef.table.tmplpr_arg_rect_mark_tl,

                            id: uuid(),
                            source__id: id,
                            lang: props.lang,

                            tltable: {
                                label,
                            }
                        },

                        joins: {},
                    }],
                }))
            }
        },

        x_value_set: (id: string, x_value: string) => {
            const x_normalized = Number.parseInt(x_value)

            if (!Number.isNaN(x_normalized)) {
                mark_update(id, { x_value: x_normalized })
            }
        },

        y_value_set: (id: string, y_value: string) => {
            const y_normalized = Number.parseInt(y_value)

            if (!Number.isNaN(y_normalized)) {
                mark_update(id, { y_value: y_normalized })
            }
        },
    }

    return <ELConEdit_MarkList>
        <rfl.CmpLoop data={props.mark_list}>
            {mark => <ELConEdit_Mark
                key={mark.id}

                id={mark.id}
                label={lang_prop(mark, props.lang, "label", "")}
                delete={api.delete}
            >
                <ELConEdit_MarkInput
                    autofocus
                    type={`text`}

                    id={mark.id}
                    value={lang_prop(mark, props.lang, "label", "")}
                    value_set={(id, label) => {
                        api.label_set(id, label, mark.tl)
                    }}
                />

                <ELConEdit_MarkInput
                    type={`number`}

                    id={mark.id}
                    value_set={api.x_value_set}
                    value={mark.x_value.toString()}
                />

                <ELConEdit_MarkInput
                    type={`number`}

                    id={mark.id}
                    value_set={api.y_value_set}
                    value={mark.y_value.toString()}
                />
            </ELConEdit_Mark>}
        </rfl.CmpLoop>
    </ELConEdit_MarkList>
}

type EL__Slider_Props = {
    readonly lang: string | null
    readonly node: cc.RemDef["tmplpr_arg_rect"]["joins"]["core"]
}

const EL_Slider: r.FC<EL__Slider_Props> = props => {
    const dispatch = asr.useAtomDispatch()

    const rect_update = function(patch: capi.SendRest_DataPatch_Body<"tmplpr_arg_rect">["patch"]) {
        dispatch(rem.tmplpr_arg_rect.act.patch({
            body: {
                id: props.node.id,

                patch,
            },
        }))
    }

    return <>
        <div className={cl(st.slider__container)}>
            <EPInSlider_ViewSq
                lang={props.lang}
                lang_fallback={""}
                mark_act={{ kind: "click" }}
                mark_style_shownum={false}
                mark_list={props.node.marks}

                x_value={props.node.x_value_def}
                x_value_step={props.node.x_value_step}
                x_value_set={x_value_def => { rect_update({ x_value_def, }) }}

                x_step_act={{
                    kind: "edit",
                    step_set: x_value_step => { rect_update({ x_value_step, }) },
                }}

                x_bound_min={{
                    value_real: props.node.x_bound_min,
                    value_view: 0,
                }}

                x_bound_max={{
                    value_real: props.node.x_bound_max,
                    value_view: props.node.x_bound_max,
                }}

                x_bound_act={{
                    kind: "edit",

                    value_min_set: x_bound_min => { rect_update({ x_bound_min }) },
                    value_max_set: x_bound_max => { rect_update({ x_bound_max }) },
                }}

                y_value={props.node.y_value_def}
                y_value_step={props.node.y_value_step}
                y_value_set={y_value_def => { rect_update({ y_value_def, }) }}

                y_step_act={{
                    kind: "edit",
                    step_set: y_value_step => { rect_update({ y_value_step, }) },
                }}

                y_bound_min={{
                    value_view: 0,
                    value_real: props.node.y_bound_min,
                }}

                y_bound_max={{
                    value_real: props.node.y_bound_max,
                    value_view: props.node.y_bound_max,
                }}

                y_bound_act={{
                    kind: "edit",

                    value_min_set: y_bound_min => { rect_update({ y_bound_min }) },
                    value_max_set: y_bound_max => { rect_update({ y_bound_max }) },
                }}
            />
        </div>
    </>
}

export type ELConEdit__TmplPrArgRect_Props = {
    readonly lang: string | null
    readonly node: cc.RemDef["tmplpr_arg_rect"]["joins"]["core"]

    readonly stmod: Readonly<Record<"line", "string">>
}

export const ELConEdit_TmplPrArgRect: r.FC<ELConEdit__TmplPrArgRect_Props> = props => {
    const dispatch = asr.useAtomDispatch()

    return <>
        <div className={cl(props.stmod.line, st.head)}>
            <EL_Marks mark_list={props.node.marks} lang={props.lang} node_id={props.node.id} />

            <EPAction_BtnClick
                style_root

                icon={"post"}

                event_click={() => {
                    dispatch(rem.tmplpr_arg_rect_mark.act.post({
                        body: [{
                            core: {
                                ...dbdef.table.tmplpr_arg_rect_mark,

                                id: uuid(),
                                x_value: props.node.x_value_def,
                                y_value: props.node.y_value_def,

                                tmplpr_arg_rect__id: props.node.id,
                            },

                            joins: {
                            },
                        }],
                    }))
                }}
            />
        </div>

        <div className={cl(props.stmod.line, st_slider.slider, st.root)}>
            <EL_Slider node={props.node} lang={props.lang} />
        </div>
    </>
}

export default ELConEdit_TmplPrArgRect
