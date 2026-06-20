import { EPInText_Context } from "@src/client/component/primitive/in-text/element/context"
import st from "@src/client/component/primitive/in-text/style/core.module.scss"
import type { EPInText_StyleModule } from "@src/client/component/primitive/in-text/type/state"
import cl from "classnames"
import * as r from "react"

type PosRange = readonly [start: number, end: number]

export type EPInText__ViewStrong_PosApi = {
    readonly selection_end: number
    readonly selection_start: number
    readonly value_after: string
    readonly value_before: string
}

export type EPInText__ViewStrong_Props = {
    readonly value: string
    readonly value_validator?: (value: string) => boolean
    readonly position_calc?: (api: EPInText__ViewStrong_PosApi | null) => PosRange | null

    readonly className?: string
    readonly children?: r.ReactNode
    readonly state_disabled?: boolean
    readonly stmod?: EPInText_StyleModule
}

export const EPInText_ViewStrong = r.forwardRef<HTMLDivElement, EPInText__ViewStrong_Props>((props, f_ref) => {
    const nprop_state_disabled = props.state_disabled ?? false

    const ref_input = r.useRef<HTMLInputElement | null>(null)
    const ref_lastpos = r.useRef<EPInText__ViewStrong_PosApi | null>(null)

    const state_error = r.useMemo(() => {
        if (props.value_validator) {
            return !props.value_validator(props.value)
        }

        return false
    }, [props.value, props.value_validator])

    r.useLayoutEffect(() => {
        const input = ref_input.current

        if (input && props.position_calc) {
            const now_position = props.position_calc(ref_lastpos.current)

            if (now_position) {
                input.setSelectionRange(now_position[0], now_position[1])
            }
        }
    }, [props.position_calc, props.value])

    return <EPInText_Context value={{
        state_error,
        stmod: props.stmod,
        ref_input: ref_input,
        state_disabled: nprop_state_disabled,

        value: props.value,
        value_kind: `controlled`,
        value_validator: props.value_validator,

        value_change: (value, config) => {
            const input = ref_input.current

            if (input) {
                if (typeof input.selectionStart === "number" && typeof input.selectionEnd === "number") {
                    ref_lastpos.current = {
                        selection_start: input.selectionStart,
                        selection_end: input.selectionEnd,
                        value_before: props.value,
                        value_after: value,
                    }
                }
            }

            config.event_value_change?.(value)

            if (config.event_value_change_valid && props.value_validator) {
                const valid = props.value_validator(value)

                if (valid) {
                    config.event_value_change_valid(value)
                }
            }
        },
    }}>
        <div
            ref={f_ref}
            aria-disabled={nprop_state_disabled}

            className={cl(
                st.intext,
                nprop_state_disabled && st._disabled,
                props.stmod?.view,
                state_error && props.stmod?._error,
                nprop_state_disabled && props.stmod?._disabled,
                props.className,
            )}
        >
            {props.children}
        </div>
    </EPInText_Context>
})

export default EPInText_ViewStrong
