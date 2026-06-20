import * as capi from "@fst/capi"
import * as cc from "@fst/config/client"
import * as dbdef from "@fst/db-default"
import { rem } from "@fst/gstate"
import * as asr from "@qyu/atom-state-react"
import st_slider from "@src/client/component/feature/console-edit/style/int_slider.module.scss"
import st from "@src/client/component/feature/console-edit/style/tmplpr_arg_bool.module.scss"
import EPInSlider_ViewLine from "@src/client/component/primitive/in-slider/element/view_line"
import { lang_prop } from "@src/client/util/tl/prop"
import cl from "classnames"
import * as r from "react"
import * as ri18 from "react-i18next"
import { v7 as uuid } from "uuid"

type EL__Slider_Props = {
    readonly lang: string | null
    readonly node: cc.RemDef["tmplpr_arg_bool"]["joins"]["core"]
}

const EL_Slider: r.FC<EL__Slider_Props> = props => {
    const dispatch = asr.useAtomDispatch()

    const update = function(patch: capi.SendRest_DataPatch_Body<"tmplpr_arg_bool">["patch"]) {
        dispatch(rem.tmplpr_arg_bool.act.patch({
            body: {
                id: props.node.id,
                patch,
            },
        }))
    }

    return <EPInSlider_ViewLine
        lang={props.lang}
        lang_fallback=""

        mark_list={[]}
        mark_act={{ kind: "click", }}

        value_step={1}
        value={props.node.value_def}
        value_set={value_def => { update({ value_def: Number(Boolean(value_def)) as 0 | 1, }) }}

        bound_min={{
            value_real: 0,
            value_view: 0,
        }}

        bound_max={{
            value_real: 1,
            value_view: 1,
        }}

        bound_act={{
            kind: "click",
        }}
    />
}

type EL__Title_Props = {
    readonly lang: string | null
    readonly node: cc.RemDef["tmplpr_arg_bool"]["joins"]["core"]
}

const EL_Title: r.FC<EL__Title_Props> = props => {
    const { t } = ri18.useTranslation()
    const dispatch = asr.useAtomDispatch()

    return <div className={st.title__container}>
        <input
            type={"text"}
            className={st.title__input}
            placeholder={t(`tmplpr.placeholder_title_falsy`)}
            value={lang_prop(props.node, props.lang, "title_false", "")}

            onChange={ev => {
                const value = ev.target.value

                if (props.lang === null) {
                    dispatch(rem.tmplpr_arg_bool.act.patch({
                        body: {
                            id: props.node.id,

                            patch: {
                                title_false: value,
                            },
                        },
                    }))
                } else {
                    for (const tlnode of props.node.tl) {
                        if (tlnode.lang === props.lang) {
                            dispatch(rem.tmplpr_arg_bool_tl.act.patch({
                                body: {
                                    id: tlnode.id,

                                    patch: {
                                        tltable: {
                                            ...tlnode.tltable,

                                            title_false: value,
                                        },
                                    }
                                },
                            }))

                            return
                        }
                    }

                    dispatch(rem.tmplpr_arg_bool_tl.act.post({
                        body: [{
                            core: {
                                ...dbdef.table.tmplpr_arg_bool_tl,

                                id: uuid(),
                                lang: props.lang,
                                source__id: props.node.id,


                                tltable: {
                                    ...dbdef.table.tmplpr_arg_bool_tl.tltable,

                                    title_false: value,
                                },
                            },

                            joins: {},
                        }],
                    }))
                }
            }}
        />

        <input
            type={"text"}
            className={st.title__input}
            placeholder={t(`tmplpr.placeholder_title_truish`)}
            value={lang_prop(props.node, props.lang, "title_true", "")}

            onChange={ev => {
                const value = ev.target.value

                if (props.lang === null) {
                    dispatch(rem.tmplpr_arg_bool.act.patch({
                        body: {
                            id: props.node.id,

                            patch: {
                                title_true: value,
                            },
                        },
                    }))
                } else {
                    for (const tlnode of props.node.tl) {
                        if (tlnode.lang === props.lang) {
                            dispatch(rem.tmplpr_arg_bool_tl.act.patch({
                                body: {
                                    id: tlnode.id,

                                    patch: {
                                        tltable: {
                                            ...tlnode.tltable,

                                            title_true: value,
                                        },
                                    }
                                },
                            }))

                            return
                        }
                    }

                    dispatch(rem.tmplpr_arg_bool_tl.act.post({
                        body: [{
                            core: {
                                ...dbdef.table.tmplpr_arg_bool_tl,

                                id: uuid(),
                                lang: props.lang,
                                source__id: props.node.id,


                                tltable: {
                                    ...dbdef.table.tmplpr_arg_bool_tl.tltable,

                                    title_true: value,
                                },
                            },

                            joins: {},
                        }],
                    }))
                }
            }}
        />
    </div>
}

export type ELConEdit__TmplPrArgBool_Props = {
    readonly lang: string | null
    readonly node: cc.RemDef["tmplpr_arg_bool"]["joins"]["core"]

    readonly stmod: Readonly<Record<"line", "string">>
}

export const ELConEdit_TmplPrArgBool: r.FC<ELConEdit__TmplPrArgBool_Props> = props => {
    return <>
        <div className={cl(props.stmod.line, st.head)}>
            <EL_Title node={props.node} lang={props.lang} />
        </div>

        <div className={cl(props.stmod.line, st_slider.slider, st.root)}>
            <EL_Slider node={props.node} lang={props.lang} />
        </div>
    </>
}

export default ELConEdit_TmplPrArgBool
