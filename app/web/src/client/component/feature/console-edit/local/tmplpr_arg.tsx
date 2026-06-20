import stheme_inoption_form from "@client/component/primitive/in-option/style/theme_form.module.scss"
import stheme_intextarea_form from "@client/component/primitive/in-textarea/style/theme_white.module.scss"
import * as cc from "@fst/config/client"
import * as cst from "@fst/cst"
import * as dbdef from "@fst/db-default"
import * as gs from "@fst/gstate"
import { rem } from "@fst/gstate"
import * as sxm from "@fst/syntax-math"
import * as asr from "@qyu/atom-state-react"
import * as rfl from "@qyu/reactcmp-flow-control"
import ELConEdit_TmplPrArgBool from "@src/client/component/feature/console-edit/local/tmplpr_arg_bool"
import ELConEdit_TmplPrArgInt from "@src/client/component/feature/console-edit/local/tmplpr_arg_line"
import ELConEdit_TmplPrArgMat from "@src/client/component/feature/console-edit/local/tmplpr_arg_mat"
import ELConEdit_TmplPrArgRect from "@src/client/component/feature/console-edit/local/tmplpr_arg_rect"
import st from "@src/client/component/feature/console-edit/style/tmplpr_arg.module.scss"
import EPAction_BtnCheck from "@src/client/component/primitive/action/element/btn_check"
import EPAction_BtnClick from "@src/client/component/primitive/action/element/btn_click"
import EPAction_BtnSelectLang from "@src/client/component/primitive/action/element/btn_select_lang"
import EPAction_View from "@src/client/component/primitive/action/element/view"
import EPCardImg_LayerFView from "@src/client/component/primitive/card-img/element/layerf_view"
import EPCardImg_LayoutMainCol from "@src/client/component/primitive/card-img/element/layout_maincol"
import EPCardImg_View from "@src/client/component/primitive/card-img/element/view"
import EPInOption_View from "@src/client/component/primitive/in-option/element/view"
import EPInText_Input from "@src/client/component/primitive/in-text/element/input"
import EPInText_ViewWeak from "@src/client/component/primitive/in-text/element/view_weak"
import st_intext from "@src/client/component/primitive/in-text/style/white.module.scss"
import EPInTextArea_Area from "@src/client/component/primitive/in-textarea/element/area"
import type { Icon_Shortcut } from "@src/client/util/icon/type/shortcut"
import { lang_prop } from "@src/client/util/tl/prop"
import cl from "classnames"
import * as r from "react"
import * as ri18 from "react-i18next"
import { v7 as uuid } from "uuid"

type EL__KindCase_Props = {
    readonly event_click: VoidFunction
    readonly icon: Icon_Shortcut
    readonly kind: cst.TmplPrArg_Kind
    readonly state_empty: boolean

    readonly node_id: string
    readonly node_kind: cst.TmplPrArg_Kind
}

const EL_KindCase: r.FC<EL__KindCase_Props> = props => {
    const dispatch = asr.useAtomDispatch()

    return <EPAction_BtnCheck
        icon={props.icon}
        state_active={props.node_kind === props.kind && !props.state_empty}

        event_click={() => {
            if (props.state_empty) {
                props.event_click()
            }

            dispatch(rem.tmplpr_arg.act.patch({
                body: {
                    id: props.node_id,

                    patch: {
                        kind: props.kind,
                    },
                },
            }))
        }}
    />
}

type EL__Switch_Props = {
    readonly node: cc.RemDef["tmplpr_arg"]["joins"]["core"]
}

const EL_Switch: r.FC<EL__Switch_Props> = props => {
    const dispatch = asr.useAtomDispatch()

    const caseprops = {
        node_id: props.node.id,
        node_kind: props.node.kind,
    }

    const post = function <
        DBKey extends Extract<keyof cc.Rest, `tmplpr_arg_${"rect" | "line" | "mat" | "bool"}`>
    >(dbkey: DBKey) {
        dispatch(rem[dbkey as "tmplpr_arg_line"].act.post({
            body: [{
                core: {
                    ...dbdef.table[dbkey as "tmplpr_arg_line"],

                    id: uuid(),
                    tmplpr_arg__id: props.node.id,
                },

                joins: {},
            }],
        }))
    }

    return <EPAction_View style_root>
        <EL_KindCase
            {...caseprops}

            icon={"arrows-alt-h"}
            kind={cst.TmplPrArg_Kind.Line}
            state_empty={props.node.defs_line.length === 0}
            event_click={() => { post("tmplpr_arg_line") }}
        />

        <EL_KindCase
            {...caseprops}

            icon={"square"}
            kind={cst.TmplPrArg_Kind.Rect}
            state_empty={props.node.defs_rect.length === 0}
            event_click={() => { post("tmplpr_arg_rect") }}
        />

        <EL_KindCase
            {...caseprops}

            icon={"toggle_off"}
            kind={cst.TmplPrArg_Kind.Bool}
            state_empty={props.node.defs_bool.length === 0}
            event_click={() => { post("tmplpr_arg_bool") }}
        />

        <EL_KindCase
            {...caseprops}

            icon={"tools"}
            kind={cst.TmplPrArg_Kind.Mat}
            state_empty={props.node.defs_mat.length === 0}
            event_click={() => { post("tmplpr_arg_mat") }}
        />
    </EPAction_View>
}

type EL__ArgBody_Props = {
    readonly lang: string | null
    readonly node: cc.RemDef["tmplpr_arg"]["joins"]["core"]
}

const EL_ArgBody: r.FC<EL__ArgBody_Props> = props => {
    const { node, node: { kind } } = props

    if (kind == cst.TmplPrArg_Kind.Line && node.defs_line.length > 0) {
        return <ELConEdit_TmplPrArgInt
            lang={props.lang}
            stmod={st as any}
            node={node.defs_line[0]!}
        />
    } else if (kind == cst.TmplPrArg_Kind.Mat && node.defs_mat.length > 0) {
        return <ELConEdit_TmplPrArgMat
            lang={props.lang}
            stmod={st as any}
            node={node.defs_mat[0]!}
        />
    } else if (kind == cst.TmplPrArg_Kind.Bool && node.defs_bool.length > 0) {
        return <ELConEdit_TmplPrArgBool
            lang={props.lang}
            stmod={st as any}
            node={node.defs_bool[0]!}
        />
    } else if (kind == cst.TmplPrArg_Kind.Rect && node.defs_rect.length > 0) {
        return <ELConEdit_TmplPrArgRect
            lang={props.lang}
            stmod={st as any}
            node={node.defs_rect[0]!}
        />
    }

    return <div className={cl(st.line, st.argbody_placeholder)}>
        <h3>
            Select an Argument Type
        </h3>
    </div>
}

enum ViewMode {
    Param = "viewmode_param",
    FormulaHidden = "viewmode_formulahidden"
}

export type ELConEdit__TmplPrArg_Props = {
    readonly node: cc.RemDef["tmplpr_arg"]["joins"]["core"]
}

export const ELConEdit_TmplPrArg: r.FC<ELConEdit__TmplPrArg_Props> = props => {
    const { t, i18n, } = ri18.useTranslation()

    const dispatch = asr.useAtomDispatch()
    const [lang, lang_set] = r.useState<null | string>(i18n.language)
    const [viewmode, viewmode_set] = r.useState(ViewMode.Param)
    const viewmode_list = r.useMemo(() => [ViewMode.Param, ViewMode.FormulaHidden] as const, [])

    return <EPCardImg_View className={st.node}>
        <EPCardImg_LayerFView>
            <EPCardImg_LayoutMainCol className={cl(st.node__content)}>
                <div className={cl(st.line, st.line_topmenu)}>
                    <EL_Switch node={props.node} />

                    <EPInOption_View
                        kind_search={false}
                        option_list={viewmode_list}
                        option_key_new={n => n}
                        placeholder={"View Mode"}
                        option_name_new={n => t(`tmplpr.${n}`)}
                        option_selection={[viewmode]}
                        option_selection_set={viewmode_set}

                        theme={{
                            ...stheme_inoption_form,

                            head: cl(stheme_inoption_form.head, st.inoption_head)
                        }}
                    />
                </div>

                <rfl.CmpIf value={viewmode === ViewMode.Param}>
                    {() => <>
                        <div className={cl(st.line, st.headline)}>
                            <EPInText_ViewWeak
                                stmod={st_intext}
                                className={cl(st.headline__intext)}
                                value={lang_prop(props.node, lang, "name", "")}
                            >
                                <EPInText_Input
                                    placeholder={t("tmplpr.placeholder_arg_name")}

                                    event_value_change={value => {
                                        if (lang === null) {
                                            dispatch(gs.rem.tmplpr_arg.act.patch({
                                                body: {
                                                    id: props.node.id,

                                                    patch: {
                                                        name: value,
                                                    },
                                                },
                                            }))
                                        } else {
                                            for (const tlnode of props.node.tl) {
                                                if (tlnode.lang === lang) {
                                                    dispatch(rem.tmplpr_arg_tl.act.patch({
                                                        body: {
                                                            id: tlnode.id,

                                                            patch: {
                                                                tltable: {
                                                                    ...tlnode.tltable,

                                                                    name: value,
                                                                },
                                                            },
                                                        },
                                                    }))

                                                    return
                                                }
                                            }

                                            dispatch(gs.rem.tmplpr_arg_tl.act.post({
                                                body: [{
                                                    core: {
                                                        ...dbdef.table.tmplpr_arg_tl,

                                                        id: uuid(),
                                                        lang,
                                                        source__id: props.node.id,

                                                        tltable: {
                                                            ...dbdef.table.tmplpr_arg_tl.tltable,

                                                            name: value,
                                                        },
                                                    },

                                                    joins: {}
                                                }],
                                            }))
                                        }
                                    }}
                                />
                            </EPInText_ViewWeak>

                            <EPAction_BtnSelectLang
                                style_root
                                value={lang}
                                event_change={lang_set}
                            />

                            <EPAction_BtnClick
                                style_root
                                style_redclr

                                icon={`trashcan`}

                                event_click={() => {
                                    dispatch(gs.rem.tmplpr_arg.act.delete({
                                        body: {
                                            ids: [props.node.id],
                                        },
                                    }))
                                }}
                            />
                        </div>

                        <EL_ArgBody node={props.node} lang={lang} />
                    </>}
                </rfl.CmpIf>

                <rfl.CmpIf value={viewmode === ViewMode.FormulaHidden}>
                    <div className={cl(st.line, st._formula)}>
                        <EPInTextArea_Area
                            stmod={stheme_intextarea_form}
                            value_default={props.node.hidden_formula}
                            placeholder={t(`tmplpr.placeholder_formula_hidden`)}

                            value_validator={value => {
                                return value === "" || sxm.expr_validate(value)
                            }}

                            event_value_change_valid={value => {
                                dispatch(gs.rem.tmplpr_arg.act.patch({
                                    body: {
                                        id: props.node.id,

                                        patch: {
                                            hidden_formula: value,
                                        },
                                    },
                                }))
                            }}
                        />
                    </div>
                </rfl.CmpIf>
            </EPCardImg_LayoutMainCol>
        </EPCardImg_LayerFView>
    </EPCardImg_View>
}

export default ELConEdit_TmplPrArg
