import { ELInSlider_Bound } from "@src/client/component/primitive/in-slider/local/bound"
import ELInSlider_Line from "@src/client/component/primitive/in-slider/local/line"
import st from "@src/client/component/primitive/in-slider/style/core.module.scss"
import type { EPInSlider_BoundAct, EPInSlider_BoundDef } from "@src/client/component/primitive/in-slider/type/bound"
import type { EPInSlider_FloatConfig } from "@src/client/component/primitive/in-slider/type/float"
import type { EPInSlider_MarkAct, EPInSlider_MarkDef } from "@src/client/component/primitive/in-slider/type/mark"
import type { EPInSlider_StepAct } from "@src/client/component/primitive/in-slider/type/step"
import type { FnSetterStateles } from "@src/client/type/fns"
import cl from "classnames"
import * as r from "react"

export type EPInSlider__ViewLine_Props = {
    readonly lang: string | null
    readonly lang_fallback: string | undefined

    readonly value: number
    readonly value_step: number
    readonly value_set: FnSetterStateles<number>

    readonly step_act?: EPInSlider_StepAct

    readonly bound_min: EPInSlider_BoundDef
    readonly bound_max: EPInSlider_BoundDef
    readonly bound_act: EPInSlider_BoundAct

    readonly mark_act: EPInSlider_MarkAct<"x_">
    readonly mark_list: readonly EPInSlider_MarkDef<"x_">[]

    readonly mark_style_shownum?: boolean
    readonly mark_style_showlabel?: boolean

    readonly style_reverse?: boolean
    readonly style_swaplabels?: boolean
    readonly style_direction?: "hor" | "ver" | "side"

    readonly className?: string
}

export const EPInSlider_ViewLine: r.FC<EPInSlider__ViewLine_Props> = props => {
    const nprop_style_reverse = props.style_reverse ?? false
    const nprop_style_direction = props.style_direction ?? "hor"
    const nprop_style_swaplabels = props.style_swaplabels ?? false

    const [drag, drag_set] = r.useState(false)

    const floatconfig: EPInSlider_FloatConfig = {
        reverse: nprop_style_reverse,
        max: props.bound_max.value_view,
        min: props.bound_min.value_view,
        vertical: nprop_style_direction === "ver" || nprop_style_direction === "side",
    }

    r.useEffect((): VoidFunction | void => {
        if (drag) {
            document.body.classList.add(st.body_drag!)

            return () => {
                document.body.classList.remove(st.body_drag!)
            }
        }
    }, [drag])

    return <div
        className={cl(
            props.className,
            st.view,
            st.view_line,
            {
                [st._drag!]: drag,
                [st._reverse!]: nprop_style_reverse,
                [st._swaplabels!]: nprop_style_swaplabels,
                [st._vertical!]: nprop_style_direction === "ver",
                [st._sideways!]: nprop_style_direction === "side",
                [st._horizontal!]: nprop_style_direction === "hor",
            }
        )}
    >
        <ELInSlider_Bound
            dir="min"
            act={props.bound_act}

            def={props.bound_min}
            def_pair={props.bound_max}

            value={props.value}
            value_set={props.value_set}

            className={st.view_line__bound_min}
        />

        <ELInSlider_Bound
            dir="max"
            act={props.bound_act}

            def={props.bound_max}
            def_pair={props.bound_min}

            value={props.value}
            value_set={props.value_set}

            className={st.view_line__bound_max}
        />

        <ELInSlider_Line
            floatconfig={floatconfig}

            lang={props.lang}
            lang_fallback={props.lang_fallback}

            mark_prefix={`x_`}
            mark_act={props.mark_act}
            mark_list={props.mark_list}
            mark_style_shownum={props.mark_style_shownum}
            mark_style_showlabel={props.mark_style_showlabel}

            drag={drag}
            drag_set={drag_set}

            value={props.value}
            value_set={props.value_set}
            value_step={props.value_step}

            step_act={props.step_act ?? null}

            bound_min={props.bound_min}
            bound_max={props.bound_max}

            className={st.view_line__line}
        />
    </div>
}

export default EPInSlider_ViewLine
