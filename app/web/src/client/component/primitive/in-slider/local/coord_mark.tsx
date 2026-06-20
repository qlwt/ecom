import type { FnSetterStateles } from "@qyu/reactcmp-dropdown"
import { ELInSlider_Editable } from "@src/client/component/primitive/in-slider/local/editable"
import st from "@src/client/component/primitive/in-slider/style/core.module.scss"
import type { EPInSlider_FloatConfig } from "@src/client/component/primitive/in-slider/type/float"
import type { EPInSlider_MarkAct, EPInSlider_MarkDef } from "@src/client/component/primitive/in-slider/type/mark"
import { elinslider__style_new_coords } from "@src/client/component/primitive/in-slider/util/style/new/coords"
import { lang_prop } from "@src/client/util/tl/prop"
import cl from "classnames"
import * as r from "react"

export type ELInSlider__CoordMark_Props = {
    readonly lang: string | null
    readonly lang_fallback: string | undefined
    readonly drag_set: FnSetterStateles<boolean>

    readonly x_value_set: FnSetterStateles<number>
    readonly y_value_set: FnSetterStateles<number>

    readonly mark_def: EPInSlider_MarkDef<"x_" | "y_">
    readonly mark_act: EPInSlider_MarkAct<"x_" | "y_">

    readonly x_floatconfig: EPInSlider_FloatConfig
    readonly y_floatconfig: EPInSlider_FloatConfig
}

export const ELInSlider_CoordMark: r.FC<ELInSlider__CoordMark_Props> = props => {
    return <div
        className={cl(st.view_sq__coords__square, st._horizontal, st._mark)}

        style={{
            ...elinslider__style_new_coords({
                x_config: props.x_floatconfig,
                y_config: props.y_floatconfig,
                x_value: props.mark_def.x_value,
                y_value: props.mark_def.y_value,
            })
        }}
    >
        <div className={st.view_sq__coords__lines} />

        <div
            className={cl(st.view_sq__coords__point)}

            onMouseDown={() => {
                props.drag_set(true)

                props.x_value_set(props.mark_def.x_value)
                props.y_value_set(props.mark_def.y_value)
            }}
        />

        <ELInSlider_Editable<"div">
            enabled={props.mark_act.kind === "edit"}
            input_default={lang_prop(props.mark_def, props.lang, "label", props.lang_fallback)}

            render_container={l_props => {
                return <div
                    {...l_props}

                    className={cl(l_props.className, st.view_sq__coords__label)}
                />
            }}

            render_main={(l_props, api) => {
                return <div
                    {...l_props}

                    className={cl(l_props.className, st.view_sq__coords__labeltext)}

                    onClick={ev => {
                        l_props.onClick?.(ev)

                        if (props.mark_act.kind === "edit") {
                            api.status_edit_set(true)
                        } else {
                            props.x_value_set(props.mark_def.x_value)
                            props.y_value_set(props.mark_def.y_value)
                        }
                    }}
                >
                    {lang_prop(props.mark_def, props.lang, "label", props.lang_fallback)}
                </div>
            }}

            render_input={l_props => {
                return <input
                    {...l_props}

                    type="text"
                    className={cl(l_props.className, st.editinput)}

                    onChange={ev => {
                        l_props.onChange?.(ev)

                        if (props.mark_act.kind === "edit") {
                            props.mark_act.label_set(props.mark_def.id, ev.currentTarget.value)
                        }
                    }}
                />
            }}
        />
    </div>
}

export default ELInSlider_CoordMark
