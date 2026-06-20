import { ELInSlider_Editable } from "@src/client/component/primitive/in-slider/local/editable"
import st from "@src/client/component/primitive/in-slider/style/core.module.scss"
import type { EPInSlider_FloatConfig } from "@src/client/component/primitive/in-slider/type/float"
import type { EPInSlider_StepAct } from "@src/client/component/primitive/in-slider/type/step"
import { elinslider__style_new_trackfloat } from "@src/client/component/primitive/in-slider/util/style/new/float"
import type { FnSetterStateles } from "@src/client/type/fns"
import cl from "classnames"
import * as r from "react"
import * as rfl from "@qyu/reactcmp-flow-control"

export type ELInSlider__Tracker_Props = {
    readonly ref_thumb?: r.Ref<HTMLDivElement | null>

    readonly drag: boolean
    readonly drag_set: FnSetterStateles<boolean>

    readonly value: number
    readonly value_min: number
    readonly value_max: number
    readonly value_step: number
    readonly value_set: FnSetterStateles<number>

    readonly step_act: EPInSlider_StepAct | null

    readonly floatconfig: EPInSlider_FloatConfig
}

export const ELInSlider_Tracker: r.FC<ELInSlider__Tracker_Props> = props => {
    const ref_clickaction_cancel = r.useRef<boolean>(false)

    r.useEffect((): VoidFunction | void => {
        if (props.drag) {
            const controller = new AbortController()

            document.addEventListener("mousemove", () => {
                ref_clickaction_cancel.current = true
            }, { signal: controller.signal })

            return () => {
                controller.abort()
            }
        }
    }, [props.drag])

    return <>
        <div
            ref={props.ref_thumb}
            className={cl(st.line__thumb)}
            style={{
                ...elinslider__style_new_trackfloat(props.floatconfig, props.value),
            }}

            onMouseDown={() => {
                props.drag_set(true)
            }}
        />

        <ELInSlider_Editable<"button">
            enabled={true}
            input_default={props.value.toString()}

            render_container={l_props => {
                return <div
                    {...l_props}

                    className={cl(l_props.className, st.underline)}
                    style={{ ...l_props.style, ...elinslider__style_new_trackfloat(props.floatconfig, props.value), }}
                />
            }}

            render_main={(l_props, api) => {
                return <button
                    {...l_props}

                    className={cl(l_props.className, st.line__label)}

                    onMouseDown={ev => {
                        l_props.onMouseDown?.(ev)

                        props.drag_set(true)
                        ref_clickaction_cancel.current = false
                    }}

                    onClick={ev => {
                        l_props.onClick?.(ev)

                        if (!props.drag || !ref_clickaction_cancel.current) {
                            props.drag_set(false)

                            api.status_edit_set(true)
                        }
                    }}
                >
                    {props.value}
                </button>
            }}

            render_input={l_props => {
                return <input
                    {...l_props}

                    type="number"
                    min={props.value_min}
                    max={props.value_max}
                    className={cl(l_props.className, st.editinput)}

                    onChange={ev => {
                        const value = ev.currentTarget.value
                        const value_parsed = Number.parseInt(value)
                        const value_normalized = Math.min(props.value_max, Math.max(props.value_min, value_parsed))

                        if (!Number.isNaN(value_normalized)) {
                            props.value_set(value_normalized)
                        }
                    }}
                />
            }}
        />

        <rfl.CmpRequire value={[props.step_act] as const}>
            {([step_act]) => {
                return <ELInSlider_Editable<"button">
                    enabled={true}
                    input_default={props.value_step.toString()}

                    render_container={l_props => {
                        return <div
                            {...l_props}

                            className={cl(l_props.className, st.underline_shift)}
                            style={{ ...l_props.style, ...elinslider__style_new_trackfloat(props.floatconfig, props.value), }}
                        />
                    }}

                    render_main={(l_props, api) => {
                        return <button
                            {...l_props}

                            className={cl(l_props.className, st.line__label)}

                            onMouseDown={ev => {
                                l_props.onMouseDown?.(ev)

                                props.drag_set(true)
                                ref_clickaction_cancel.current = false
                            }}

                            onClick={ev => {
                                l_props.onClick?.(ev)

                                if (!props.drag || !ref_clickaction_cancel.current) {
                                    props.drag_set(false)

                                    api.status_edit_set(true)
                                }
                            }}
                        >
                            {props.value_step}
                        </button>
                    }}

                    render_input={l_props => {
                        return <input
                            {...l_props}

                            min={1}
                            max={100}
                            type="number"
                            className={cl(l_props.className, st.editinput)}

                            onChange={ev => {
                                const value = ev.currentTarget.value
                                const value_parsed = Number.parseInt(value)
                                const value_normalized = Math.max(1, value_parsed)

                                if (!Number.isNaN(value_normalized)) {
                                    step_act.step_set(value_normalized)
                                }
                            }}
                        />
                    }}
                />
            }}
        </rfl.CmpRequire>
    </>
}
