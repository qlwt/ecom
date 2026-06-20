import * as rmask from "react-imask"
import { EPInText_Context } from "@src/client/component/primitive/in-text/element/context"
import st from "@src/client/component/primitive/in-text/style/core.module.scss"
import * as r from "react"
import cl from "classnames"
import { useRefMerge } from "@src/client/hook/ref/merge"

export type EPInText__Input_Props = {
    readonly id?: string
    readonly mask?: string
    readonly className?: string
    readonly placeholder?: string
    readonly format?: (value: string) => string | null
    readonly type?: r.JSX.IntrinsicElements["input"]["type"]

    readonly event_submit?: VoidFunction
    readonly event_value_change?: (value: string) => void
    readonly event_value_change_valid?: (value: string) => void
}

export const EPInText_Input = r.forwardRef<HTMLInputElement, EPInText__Input_Props>((props, f_ref) => {
    const state = r.useContext(EPInText_Context)

    if (!state) { throw new Error(`Using element outside of EPInText_Context`) }

    const { ref: ref_rmask } = rmask.useIMask({ mask: props.mask })

    const ref = useRefMerge<HTMLInputElement>(f_ref, ref_rmask as any, state.ref_input)

    return <input
        ref={ref}
        id={props.id}
        type={props.type ?? "text"}
        placeholder={props.placeholder}
        disabled={state.state_disabled}

        className={cl(
            st.intext__input,
            state.state_disabled && st._disabled,
            state.stmod?.input,
            state.state_disabled && state.stmod?._disabled,
            props.className
        )}

        {...(state.value_kind === "default"
            ? { defaultValue: state.value }
            : { value: state.value }
        )}

        onChange={ev => {
            const value = props.format ? props.format(ev.target.value) : ev.target.value

            if (typeof value === "string") {
                state.value_change(value, {
                    event_value_change: props.event_value_change,
                    event_value_change_valid: props.event_value_change_valid,
                })
            }
        }}

        onKeyDown={ev => {
            if (!(ev.altKey || ev.ctrlKey || ev.metaKey || ev.shiftKey)) {
                switch (ev.key.toLowerCase()) {
                    case "enter": {
                        props.event_submit?.()
                    }
                }
            }
        }}
    />
})

export default EPInText_Input
