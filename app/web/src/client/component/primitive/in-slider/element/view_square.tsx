import * as rfl from "@qyu/reactcmp-flow-control"
import { ELInSlider_Bound } from "@src/client/component/primitive/in-slider/local/bound"
import ELInSlider_CoordMark from "@src/client/component/primitive/in-slider/local/coord_mark"
import ELInSlider_CoordThumb from "@src/client/component/primitive/in-slider/local/coord_thumb"
import ELInSlider_Line from "@src/client/component/primitive/in-slider/local/line"
import st from "@src/client/component/primitive/in-slider/style/core.module.scss"
import type { EPInSlider_BoundAct, EPInSlider_BoundDef } from "@src/client/component/primitive/in-slider/type/bound"
import type { EPInSlider_FloatConfig } from "@src/client/component/primitive/in-slider/type/float"
import type { EPInSlider_MarkAct, EPInSlider_MarkDef } from "@src/client/component/primitive/in-slider/type/mark"
import type { EPInSlider_StepAct } from "@src/client/component/primitive/in-slider/type/step"
import type { FnSetterStateles } from "@src/client/type/fns"
import cl from "classnames"
import * as r from "react"

export type EPInSlider__ViewSq_Props = {
    readonly lang: string | null
    readonly lang_fallback: string | undefined

    readonly x_value: number
    readonly x_value_step: number
    readonly x_value_set: FnSetterStateles<number>

    readonly x_step_act?: EPInSlider_StepAct

    readonly mark_act: EPInSlider_MarkAct<"x_" | "y_">
    readonly mark_list: readonly EPInSlider_MarkDef<"x_" | "y_">[]
    readonly mark_style_shownum?: boolean

    readonly x_bound_min: EPInSlider_BoundDef
    readonly x_bound_max: EPInSlider_BoundDef
    readonly x_bound_act: EPInSlider_BoundAct

    readonly y_value: number
    readonly y_value_step: number
    readonly y_value_set: FnSetterStateles<number>

    readonly y_step_act?: EPInSlider_StepAct

    readonly y_bound_min: EPInSlider_BoundDef
    readonly y_bound_max: EPInSlider_BoundDef
    readonly y_bound_act: EPInSlider_BoundAct

    readonly className?: string
}

export const EPInSlider_ViewSq: r.FC<EPInSlider__ViewSq_Props> = props => {
    const [drag, drag_set] = r.useState(false)
    const [x_drag, x_drag_set] = r.useState(false)
    const [y_drag, y_drag_set] = r.useState(false)

    const ref_view = r.useRef<HTMLDivElement | null>(null)

    const x_floatconfig: EPInSlider_FloatConfig = {
        reverse: false,
        vertical: false,
        max: props.x_bound_max.value_view,
        min: props.x_bound_min.value_view,
    }

    const y_floatconfig: EPInSlider_FloatConfig = {
        reverse: true,
        vertical: true,
        max: props.y_bound_max.value_view,
        min: props.y_bound_min.value_view,
    }

    r.useEffect((): VoidFunction | void => {
        if (drag || y_drag || x_drag) {
            document.body.classList.add(st.body_drag!)

            return () => {
                document.body.classList.remove(st.body_drag!)
            }
        }
    }, [drag || y_drag || x_drag])

    r.useEffect((): VoidFunction | void => {
        if (drag) {
            const controller = new AbortController()

            document.body.classList.add(st.body_drag!)

            document.addEventListener("mouseup", () => {
                drag_set(false)
            }, { signal: controller.signal })

            return () => {
                controller.abort()

                document.body.classList.remove(st.body_drag!)
            }
        }
    }, [drag])

    return <div
        ref={ref_view}

        className={cl(
            props.className,
            st.view,
            st.view_sq,
        )}
    >
        <ELInSlider_Bound
            dir="min"
            act={props.x_bound_act}

            def={props.x_bound_min}
            def_pair={props.x_bound_max}

            value={props.x_value}
            value_set={props.x_value_set}

            className={cl(st.view_sq__bound_hormin, st._horizontal, x_drag && st._drag)}
        />

        <ELInSlider_Bound
            dir="max"
            act={props.x_bound_act}

            def={props.x_bound_max}
            def_pair={props.x_bound_min}

            value={props.x_value}
            value_set={props.x_value_set}

            className={cl(st.view_sq__bound_hormax, st._horizontal, x_drag && st._drag)}
        />

        <div className={cl(st.view_sq__horline)}>
            <ELInSlider_Line
                mark_prefix={`x_`}
                mark_act={props.mark_act}
                mark_list={props.mark_list}

                mark_style_showlabel={false}
                mark_style_shownum={props.mark_style_shownum}

                floatconfig={x_floatconfig}

                lang={props.lang}
                lang_fallback={props.lang_fallback}

                drag={x_drag || drag}
                drag_set={x_drag_set}

                value={props.x_value}
                value_set={props.x_value_set}
                value_step={props.x_value_step}

                step_act={props.x_step_act ?? null}

                bound_min={props.x_bound_min}
                bound_max={props.x_bound_max}

                className={cl(st._horizontal, x_drag && st._drag)}
            />
        </div>

        <ELInSlider_Bound
            dir="min"
            act={props.y_bound_act}

            def={props.y_bound_min}
            def_pair={props.y_bound_max}

            value={props.y_value}
            value_set={props.y_value_set}

            className={cl(st.view_sq__bound_vermin, st._vertical, st._reverse, y_drag && st._drag)}
        />

        <ELInSlider_Bound
            dir="max"
            act={props.y_bound_act}

            def={props.y_bound_max}
            def_pair={props.y_bound_min}

            value={props.y_value}
            value_set={props.y_value_set}

            className={cl(st.view_sq__bound_vermax, st._vertical, st._reverse, y_drag && st._drag)}
        />

        <div className={cl(st.view_sq__verline)}>
            <ELInSlider_Line
                floatconfig={y_floatconfig}

                lang={props.lang}
                lang_fallback={props.lang_fallback}

                mark_prefix={`y_`}
                mark_act={props.mark_act}
                mark_list={props.mark_list}

                mark_style_showlabel={false}
                mark_style_shownum={props.mark_style_shownum}

                drag={y_drag || drag}
                drag_set={y_drag_set}

                value={props.y_value}
                value_set={props.y_value_set}
                value_step={props.y_value_step}

                step_act={props.y_step_act ?? null}

                bound_min={props.y_bound_min}
                bound_max={props.y_bound_max}

                className={cl(st._vertical, st._reverse, y_drag && st._drag)}
            />
        </div>

        <div className={st.view_sq__coords__view}>
            <div className={st.view_sq__coords__screen}>
                <ELInSlider_CoordThumb
                    drag_set={drag_set}

                    x_value={props.x_value}
                    x_floatconfig={x_floatconfig}

                    y_value={props.y_value}
                    y_floatconfig={y_floatconfig}
                />

                <rfl.CmpLoop data={props.mark_list}>
                    {mark => <ELInSlider_CoordMark
                        key={mark.id}

                        drag_set={drag_set}

                        lang={props.lang}
                        lang_fallback={props.lang_fallback}

                        mark_def={mark}
                        mark_act={props.mark_act}

                        x_floatconfig={x_floatconfig}
                        x_value_set={props.x_value_set}

                        y_floatconfig={y_floatconfig}
                        y_value_set={props.y_value_set}
                    />}
                </rfl.CmpLoop>
            </div>
        </div>
    </div>
}

export default EPInSlider_ViewSq
