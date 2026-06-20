import type { FnSetterStateles } from "@qyu/reactcmp-dropdown"
import * as rfl from "@qyu/reactcmp-flow-control"
import { ELInSlider_Mark } from "@src/client/component/primitive/in-slider/local/mark"
import ELInSlider_Track from "@src/client/component/primitive/in-slider/local/track"
import { ELInSlider_Tracker } from "@src/client/component/primitive/in-slider/local/tracker"
import st from "@src/client/component/primitive/in-slider/style/core.module.scss"
import type { EPInSlider_BoundDef } from "@src/client/component/primitive/in-slider/type/bound"
import type { EPInSlider_DragParams } from "@src/client/component/primitive/in-slider/type/drag"
import type { EPInSlider_FloatConfig } from "@src/client/component/primitive/in-slider/type/float"
import type { EPInSlider_MarkAct, EPInSlider_MarkDef } from "@src/client/component/primitive/in-slider/type/mark"
import type { EPInSlider_StepAct } from "@src/client/component/primitive/in-slider/type/step"
import cl from "classnames"
import * as r from "react"

export type ELInSlider__Line_Props<MarkPrefix extends string> = {
    readonly lang: string | null
    readonly lang_fallback: string | undefined
    readonly floatconfig: EPInSlider_FloatConfig

    readonly mark_prefix: MarkPrefix
    readonly mark_act: EPInSlider_MarkAct<MarkPrefix>
    readonly mark_list: readonly EPInSlider_MarkDef<MarkPrefix>[]
    readonly mark_style_shownum?: boolean
    readonly mark_style_showlabel?: boolean

    readonly value: number
    readonly value_step: number
    readonly value_set: FnSetterStateles<number>

    readonly step_act: EPInSlider_StepAct | null

    readonly bound_min: EPInSlider_BoundDef
    readonly bound_max: EPInSlider_BoundDef

    readonly drag: boolean
    readonly drag_set: FnSetterStateles<boolean>

    readonly className?: string
}

export const ELInSlider_Line = function <MarkPrefix extends string>(props: ELInSlider__Line_Props<MarkPrefix>): r.ReactNode {
    const ref_track = r.useRef<HTMLDivElement | null>(null)
    const ref_thumb = r.useRef<HTMLDivElement | null>(null)

    const drag_update = r.useCallback((params: EPInSlider_DragParams) => {
        const track = ref_track.current
        const thumb = ref_thumb.current

        if (track && thumb) {
            const track_rect = track.getBoundingClientRect()
            const thumb_rect = thumb.getBoundingClientRect()
            const range_view = Math.abs(props.bound_max.value_view - props.bound_min.value_view)
            const min_gap = Math.abs(props.bound_min.value_view - props.bound_min.value_real)
            const max_gap = Math.abs(props.bound_max.value_view - props.bound_max.value_real)
            const range_real = Math.abs(props.bound_max.value_real - props.bound_min.value_real)

            let mouse_point
            let line_point
            let line_size

            if (props.floatconfig.vertical) {
                mouse_point = params.y
                line_size = track_rect.height - (min_gap + max_gap) / range_view * track_rect.height - thumb_rect.height
                line_point = track_rect.y + 0 * min_gap / range_view * track_rect.height + thumb_rect.height / 2
            } else {
                mouse_point = params.x
                line_size = track_rect.width - (min_gap + max_gap) / range_view * track_rect.width - thumb_rect.width
                line_point = track_rect.x + min_gap / range_view * track_rect.width + thumb_rect.width / 2
            }

            const progress = Math.abs(
                + Number(props.floatconfig.reverse)
                - Math.max(0, Math.min(1,
                    (
                        + mouse_point
                        - line_point
                    )
                    / line_size
                ))
            )

            const value_raw = Math.min(props.bound_min.value_real + Math.round(range_real * progress))
            const value_modulo = value_raw % props.value_step

            props.value_set(
                + value_raw
                - value_modulo
                + props.value_step * Math.ceil(
                    (value_raw % props.value_step) / props.value_step
                )
            )
        }
    }, [props.bound_max, props.bound_min, props.floatconfig, props.value_set, props.value_step])

    r.useEffect((): VoidFunction | void => {
        if (props.drag) {
            const controller = new AbortController()

            document.addEventListener("mouseup", () => {
                props.drag_set(false)
            }, { signal: controller.signal })

            document.addEventListener("mousemove", event => {
                drag_update(event)
            }, { signal: controller.signal })

            return () => {
                controller.abort()
            }
        }
    }, [props.drag, drag_update])

    const value_move = r.useCallback((movement: number) => {
        const value_normalized = Math.max(
            props.bound_min.value_real,
            Math.min(props.bound_max.value_real, props.value + movement)
        )

        if (value_normalized !== props.value) {
            props.value_set(value_normalized)
        }
    }, [props.value, props.value_set, props.bound_min, props.bound_max])

    return <div
        className={cl(props.className, st.line)}

        tabIndex={0}

        onKeyDown={ev => {
            if (!(ev.altKey || ev.ctrlKey || ev.metaKey)) {
                switch (ev.key.toLowerCase()) {
                    case "arrowleft": {
                        ev.preventDefault()

                        value_move(
                            (
                                ev.shiftKey
                                    ? -5 * props.value_step
                                    : -props.value_step
                            )
                            * (
                                props.floatconfig.reverse
                                    ? -1
                                    : 1
                            )
                        )

                        break
                    }
                    case "arrowright": {
                        ev.preventDefault()

                        value_move(
                            (
                                ev.shiftKey
                                    ? 5 * props.value_step
                                    : 1 * props.value_step
                            )
                            * (
                                props.floatconfig.reverse
                                    ? -1
                                    : 1
                            )
                        )

                        break
                    }
                }
            }
        }}
    >
        <ELInSlider_Track
            value={props.value}
            ref_track={ref_track}
            floatconfig={props.floatconfig}

            drag_set={props.drag_set}
            drag_update={drag_update}
        />

        <rfl.CmpLoop data={props.mark_list}>
            {mark => {
                return <ELInSlider_Mark
                    key={mark.id}

                    def={mark}
                    id={mark.id}
                    act={props.mark_act}
                    prefix={props.mark_prefix}
                    floatconfig={props.floatconfig}

                    lang={props.lang}
                    lang_fallback={props.lang_fallback}

                    style_shownum={props.mark_style_shownum}
                    style_showlabel={props.mark_style_showlabel}

                    drag={props.drag}
                    drag_set={props.drag_set}

                    value_set={props.value_set}
                    value_min={props.bound_min.value_view}
                    value_max={props.bound_max.value_view}
                />
            }}
        </rfl.CmpLoop>

        <ELInSlider_Tracker
            ref_thumb={ref_thumb}

            drag={props.drag}
            drag_set={props.drag_set}

            value={props.value}
            value_set={props.value_set}
            value_step={props.value_step}
            value_min={props.bound_min.value_real}
            value_max={props.bound_max.value_real}

            step_act={props.step_act}

            floatconfig={props.floatconfig}
        />
    </div>
}

export default ELInSlider_Line
