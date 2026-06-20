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
import st from "@src/client/component/feature/console-edit/style/tmplpr_arg_int.module.scss"
import EPAction_BtnClick from "@src/client/component/primitive/action/element/btn_click"
import EPInSlider_ViewLine from "@src/client/component/primitive/in-slider/element/view_line"
import { lang_prop } from "@src/client/util/tl/prop"
import cl from "classnames"
import * as r from "react"
import { v7 as uuid } from "uuid"

type EL__Slider_Props = {
    readonly lang: string | null
    readonly node: cc.RemDef["tmplpr_arg_line"]["joins"]["core"]
}

const EL_Slider: r.FC<EL__Slider_Props> = props => {
    const dispatch = asr.useAtomDispatch()

    const update = function(patch: capi.SendRest_DataPatch_Body<"tmplpr_arg_line">["patch"]) {
        dispatch(rem.tmplpr_arg_line.act.patch({
            body: {
                id: props.node.id,

                patch,
            },
        }))
    }

    return <EPInSlider_ViewLine
        lang={props.lang}
        lang_fallback=""

        mark_list={props.node.marks}
        mark_act={{ kind: "click", }}

        step_act={{
            kind: "edit",
            step_set: x_value_step => { update({ x_value_step }) }
        }}

        value={props.node.x_value_def}
        value_step={props.node.x_value_step}
        value_set={x_value_def => { update({ x_value_def, }) }}

        bound_min={{
            value_real: props.node.x_bound_min,
            value_view: props.node.x_bound_min,
        }}

        bound_max={{
            value_real: props.node.x_bound_max,
            value_view: props.node.x_bound_max,
        }}

        bound_act={{
            kind: "edit",
            value_min_set: x_bound_min => { update({ x_bound_min, }) },
            value_max_set: x_bound_max => { update({ x_bound_max, }) },
        }}
    />
}

type EL__Marks_Props = {
    readonly node_id: string
    readonly lang: string | null
    readonly mark_list: readonly cc.RemDef["tmplpr_arg_line_mark"]["joins"]["core"][]
}

const EL_Marks: r.FC<EL__Marks_Props> = props => {
    const dispatch = asr.useAtomDispatch()

    const mark_update = function(id: string, patch: capi.SendRest_DataPatch_Body<"tmplpr_arg_line_mark">["patch"]) {
        dispatch(rem.tmplpr_arg_line_mark.act.patch({
            body: {
                id,
                patch,
            },
        }))
    }

    const api = {
        delete: (id: string) => {
            dispatch(rem.tmplpr_arg_line_mark.act.delete({
                body: { ids: [id] }
            }))
        },

        label_set: (id: string, label: string, tl: readonly cc.RemDef["tmplpr_arg_line_mark_tl"]["joins"]["core"][]) => {
            if (props.lang === null) {
                mark_update(id, { label })
            } else {
                for (const tlnode of tl) {
                    if (tlnode.lang === props.lang) {
                        dispatch(rem.tmplpr_arg_line_mark_tl.act.patch({
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

                dispatch(rem.tmplpr_arg_line_mark_tl.act.post({
                    body: [{
                        core: {
                            ...dbdef.table.tmplpr_arg_line_mark_tl,

                            id: uuid(),
                            source__id: id,
                            lang: props.lang,

                            tltable: {
                                label,
                            },
                        },

                        joins: {}
                    }],
                }))
            }
        },

        value_set: (id: string, value: string) => {
            const normalized = Number.parseInt(value)

            if (!Number.isNaN(normalized)) {
                mark_update(id, { x_value: normalized })
            }
        },
    }

    return <ELConEdit_MarkList>
        <rfl.CmpLoop data={props.mark_list}>
            {mark => <ELConEdit_Mark
                key={mark.id}

                id={mark.id}
                delete={api.delete}
                label={lang_prop(mark, props.lang, "label", "")}
            >
                <ELConEdit_MarkInput
                    autofocus
                    type={`text`}

                    id={mark.id}
                    value={lang_prop(mark, props.lang, "label", "")}

                    value_set={(id, value) => {
                        api.label_set(id, value, mark.tl)
                    }}
                />

                <ELConEdit_MarkInput
                    type={`number`}

                    id={mark.id}
                    value_set={api.value_set}
                    value={mark.x_value.toString()}
                />
            </ELConEdit_Mark>}
        </rfl.CmpLoop>
    </ELConEdit_MarkList>
}

export type ELConEdit__TmplPrArgInt_Props = {
    readonly lang: string | null
    readonly node: cc.RemDef["tmplpr_arg_line"]["joins"]["core"]

    readonly stmod: Readonly<Record<"line", "string">>
}

export const ELConEdit_TmplPrArgInt: r.FC<ELConEdit__TmplPrArgInt_Props> = props => {
    const dispatch = asr.useAtomDispatch()

    return <>
        <div className={cl(props.stmod.line, st.head)}>
            <EL_Marks node_id={props.node.id} mark_list={props.node.marks} lang={props.lang} />

            <EPAction_BtnClick
                style_root

                icon={"post"}

                event_click={() => {
                    dispatch(rem.tmplpr_arg_line_mark.act.post({
                        body: [{
                            core: {
                                ...dbdef.table.tmplpr_arg_line_mark,

                                id: uuid(),
                                x_value: props.node.x_value_def,
                                tmplpr_arg_line__id: props.node.id,
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

export default ELConEdit_TmplPrArgInt
