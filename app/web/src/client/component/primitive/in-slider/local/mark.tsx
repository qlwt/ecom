import * as rfl from "@qyu/reactcmp-flow-control"
import { ELInSlider_Editable } from "@src/client/component/primitive/in-slider/local/editable"
import st from "@src/client/component/primitive/in-slider/style/core.module.scss"
import type { EPInSlider_FloatConfig } from "@src/client/component/primitive/in-slider/type/float"
import type { EPInSlider_MarkAct, EPInSlider_MarkDef } from "@src/client/component/primitive/in-slider/type/mark"
import { elinslider__style_new_trackfloat } from "@src/client/component/primitive/in-slider/util/style/new/float"
import type { FnSetterStateles } from "@src/client/type/fns"
import { lang_prop } from "@src/client/util/tl/prop"
import cl from "classnames"
import * as r from "react"

export type ELInSlider__Mark_Props<MarkPrefix extends string> = {
    readonly id: string
    readonly prefix: MarkPrefix
    readonly act: EPInSlider_MarkAct<MarkPrefix>
    readonly def: EPInSlider_MarkDef<MarkPrefix>
    readonly floatconfig: EPInSlider_FloatConfig

    readonly lang: string | null
    readonly lang_fallback: string | undefined

    readonly drag: boolean
    readonly drag_set: FnSetterStateles<boolean>

    readonly value_min: number
    readonly value_max: number
    readonly value_set: FnSetterStateles<number>

    readonly style_shownum?: boolean
    readonly style_showlabel?: boolean
}

export const ELInSlider_Mark = function <MarkPrefix extends string>(props: ELInSlider__Mark_Props<MarkPrefix>): r.ReactNode {
    const nprop_style_shownum = props.style_shownum ?? false
    const nprop_style_showlabel = props.style_showlabel ?? true
    const nprop_prefix = props.prefix as "x_" | "y_" | "z_"
    const nprop_def = props.def as unknown as EPInSlider_MarkDef<typeof nprop_prefix>
    const nprop_act = props.act as unknown as EPInSlider_MarkAct<typeof nprop_prefix>

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
        <rfl.CmpIf value={nprop_style_showlabel}>
            {() => <ELInSlider_Editable<"button">
                enabled={props.act.kind === "edit"}
                input_default={lang_prop(nprop_def, props.lang, "label", props.lang_fallback)}

                render_container={l_props => {
                    return <div
                        {...l_props}

                        className={cl(l_props.className, st.overline)}
                        style={{ ...l_props.style, ...elinslider__style_new_trackfloat(props.floatconfig, nprop_def[`${nprop_prefix}value`]) }}
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

                                switch (nprop_act.kind) {
                                    case "edit": {
                                        api.status_edit_set(true)

                                        break
                                    }
                                    case "click": {
                                        props.value_set(nprop_def[`${nprop_prefix}value`])

                                        break
                                    }
                                }
                            }
                        }}
                    >
                        {lang_prop(nprop_def, props.lang, "label", props.lang_fallback)}
                    </button>
                }}

                render_input={l_props => {
                    return <input
                        {...l_props}

                        type="text"
                        className={cl(l_props.className, st.editinput, st.editinput_text)}

                        onChange={ev => {
                            l_props.onChange?.(ev)

                            if (nprop_act.kind === "edit") {
                                nprop_act.label_set(props.id, ev.currentTarget.value)
                            }
                        }}

                        onBlur={ev => {
                            l_props.onBlur?.(ev)

                            if (ev.currentTarget.value.trim().length === 0) {
                                if (nprop_act.kind === "edit") {
                                    nprop_act.delete(props.id)
                                }
                            }
                        }}
                    />
                }}
            />}
        </rfl.CmpIf>

        <div
            className={cl(st.line__mark)}
            style={elinslider__style_new_trackfloat(props.floatconfig, nprop_def[`${nprop_prefix}value`],)}

            onMouseDown={() => {
                props.drag_set(true)
                props.value_set(nprop_def[`${nprop_prefix}value`])
            }}
        />

        <rfl.CmpIf value={nprop_style_shownum}>
            {() => <ELInSlider_Editable<"button">
                enabled={props.act.kind === "edit"}
                input_default={nprop_def[`${nprop_prefix}value`].toString()}

                render_container={l_props => {
                    return <div
                        {...l_props}

                        className={cl(l_props.className, st.underline_shift)}
                        style={{ ...l_props.style, ...elinslider__style_new_trackfloat(props.floatconfig, nprop_def[`${nprop_prefix}value`]) }}
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

                                switch (nprop_act.kind) {
                                    case "edit": {
                                        api.status_edit_set(true)

                                        break
                                    }
                                    case "click": {
                                        props.value_set(nprop_def[`${nprop_prefix}value`])

                                        break
                                    }
                                }
                            }
                        }}
                    >
                        {nprop_def[`${nprop_prefix}value`]}
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
                            l_props.onChange?.(ev)

                            if (nprop_act.kind === "edit") {
                                const value = ev.currentTarget.value
                                const value_parsed = Number.parseInt(value)
                                const value_normalized = Math.min(props.value_max, Math.max(props.value_min, value_parsed))

                                if (!Number.isNaN(value_normalized)) {
                                    nprop_act[`${nprop_prefix}value_set`](props.id, value_normalized)
                                }
                            }
                        }}
                    />
                }}
            />}
        </rfl.CmpIf>
    </>
}
