import { ELInSlider_Editable } from "@src/client/component/primitive/in-slider/local/editable"
import st from "@src/client/component/primitive/in-slider/style/core.module.scss"
import type { EPInSlider_BoundAct, EPInSlider_BoundDef } from "@src/client/component/primitive/in-slider/type/bound"
import type { FnSetterStateles } from "@src/client/type/fns"
import cl from "classnames"
import * as r from "react"

type EL__Input_Props = {
    readonly status_edit: boolean
    readonly parent_props: r.JSX.IntrinsicElements["input"]

    readonly dir: "min" | "max"
    readonly act: EPInSlider_BoundAct

    readonly def: EPInSlider_BoundDef
    readonly def_pair: EPInSlider_BoundDef

    readonly value: number
    readonly value_set: FnSetterStateles<number>
}

const EL_Input: r.FC<EL__Input_Props> = props => {
    const [l_value, l_value_set] = r.useState(props.value.toString())

    r.useLayoutEffect(() => {
        if (props.status_edit) {
            l_value_set(props.def.value_real.toString())
        }
    }, [props.status_edit])

    return <input
        {...props.parent_props}

        type="number"
        value={l_value}
        min={0}
        max={Math.trunc(props.def.value_view + 1)}
        className={cl(props.parent_props.className, st.editinput)}

        onChange={ev => {
            props.parent_props.onChange?.(ev)

            l_value_set(ev.target.value)
        }}

        onBlur={ev => {
            props.parent_props.onBlur?.(ev)

            const value = l_value
            const value_parsed = Number.parseInt(value)
            const value_normalized = Math.max(0, value_parsed)

            if (!Number.isNaN(value_normalized) && props.act.kind === "edit") {
                if (props.dir === "min") {
                    if (value_normalized > props.value) {
                        props.value_set(value_normalized)
                    }

                    if (value_normalized >= props.def_pair.value_real) {
                        props.act.value_max_set(value_normalized + 1)
                    }

                    props.act.value_min_set(value_normalized)
                } else {
                    if (value_normalized < props.value) {
                        props.value_set(value_normalized)
                    }

                    if (value_normalized <= props.def_pair.value_real) {
                        props.act.value_min_set(value_normalized - 1)
                    }

                    props.act.value_max_set(value_normalized)
                }
            }
        }}
    />
}

export type ELInSlider__Bound_Props = {
    readonly dir: "min" | "max"

    readonly act: EPInSlider_BoundAct
    readonly def: EPInSlider_BoundDef
    readonly def_pair: EPInSlider_BoundDef

    readonly value: number
    readonly value_set: FnSetterStateles<number>

    readonly className?: string
}

export const ELInSlider_Bound: r.FC<ELInSlider__Bound_Props> = props => {
    return <ELInSlider_Editable<"button">
        enabled={props.act.kind === "edit"}
        input_default={`${props.def.value_real}`}

        render_container={l_props => {
            return <div
                {...l_props}

                className={cl(l_props.className, props.className, st.bound__view)}
            />
        }}

        render_main={(l_props, api) => {
            return <button
                {...l_props}

                className={cl(l_props.className, st.bound)}

                onClick={(ev) => {
                    l_props.onClick?.(ev)

                    switch (props.act.kind) {
                        case "click":
                            props.value_set(props.def.value_real)

                            break
                        case "edit":
                            api.status_edit_set(true)

                            break
                    }
                }}
            >
                {props.def.value_view}
            </button>
        }}

        render_input={(l_props, api) => {
            return <EL_Input
                parent_props={l_props}

                dir={props.dir}
                act={props.act}
                def={props.def}
                def_pair={props.def_pair}

                status_edit={api.status_edit}

                value={props.value}
                value_set={props.value_set}
            />
        }}
    />
}
