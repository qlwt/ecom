import { EPInText_Context } from "@src/client/component/primitive/in-text/element/context"
import st from "@src/client/component/primitive/in-text/style/core.module.scss"
import type { EPInText_StyleModule } from "@src/client/component/primitive/in-text/type/state"
import cl from "classnames"
import * as r from "react"

export type EPInText__ViewWeak_Props = {
    readonly value: string
    readonly value_nosync?: boolean
    readonly value_validator?: (value: string) => boolean
    readonly value_comparator?: (a: string, b: string) => boolean

    readonly className?: string
    readonly children?: r.ReactNode
    readonly state_disabled?: boolean
    readonly stmod?: EPInText_StyleModule
}

export const EPInText_ViewWeak = r.forwardRef<HTMLDivElement, EPInText__ViewWeak_Props>((props, f_ref) => {
    const nprop_value_nosync = props.value_nosync ?? false
    const nprop_state_disabled = props.state_disabled ?? false
    const nprop_value_comparator = props.value_comparator ?? Object.is

    const ref_input = r.useRef<HTMLInputElement | null>(null)
    const value_default = r.useMemo(() => props.value, [])

    const [state_error, state_error_set] = r.useState(() => {
        if (props.value_validator) {
            return props.value_validator(value_default)
        }

        return false
    })

    r.useLayoutEffect(() => {
        if (!nprop_value_nosync) {
            const input = ref_input.current

            if (input && !nprop_value_comparator(props.value, input.value)) {
                input.value = props.value

                if (props.value_validator) {
                    state_error_set(!props.value_validator(props.value))
                }
            }
        }
    }, [props.value, nprop_value_comparator, nprop_value_nosync])

    r.useLayoutEffect(() => {
        const input = ref_input.current

        if (input) {
            if (props.value_validator) {
                state_error_set(!props.value_validator(input.value))
            } else {
                state_error_set(false)
            }
        }
    }, [props.value_validator])

    return <EPInText_Context value={{
        state_error,
        stmod: props.stmod,
        ref_input: ref_input,
        state_disabled: nprop_state_disabled,

        value: value_default,
        value_kind: `default`,
        value_validator: props.value_validator,

        value_change: (value, config) => {
            config.event_value_change?.(value)

            if (config.event_value_change_valid) {
                if (props.value_validator) {
                    const valid = props.value_validator(value)

                    state_error_set(!valid)

                    if (valid) {
                        config.event_value_change_valid(value)
                    }
                } else {
                    state_error_set(false)

                    config.event_value_change_valid(value)
                }
            } else {
                if (props.value_validator) {
                    state_error_set(!props.value_validator(value))
                }
            }
        },
    }}>
        <div
            ref={f_ref}

            className={cl(
                st.intext,
                nprop_state_disabled && st._disabled,
                props.stmod?.view,
                state_error && props.stmod?._error,
                nprop_state_disabled && props.stmod?._disabled,
                props.className,
            )}

            onClick={ev => {
                if (ev.currentTarget === ev.target) {
                    const el = ref_input.current

                    if (el && ev.target !== el) {
                        el.focus()
                        el.setSelectionRange(el.value.length, el.value.length)
                    }
                }
            }}
        >
            {props.children}
        </div>
    </EPInText_Context>
})

export default EPInText_ViewWeak
