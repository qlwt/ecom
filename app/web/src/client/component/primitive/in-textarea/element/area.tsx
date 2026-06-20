import st from "@src/client/component/primitive/in-textarea/style/core.module.scss"
import type { EPInTextArea_StyleModule } from "@src/client/component/primitive/in-textarea/type/stmod"
import { useRefMerge } from "@src/client/hook/ref/merge"
import cl from "classnames"
import * as r from "react"

export type EPInTextArea__Area_Props = {
    readonly id?: string
    readonly placeholder?: string
    readonly state_disabled?: boolean

    readonly value_default: string
    readonly value_validator?: (value: string) => boolean
    readonly value_comparator?: (a: string, b: string) => boolean

    readonly className?: string
    readonly stmod?: EPInTextArea_StyleModule

    readonly rows?: number
    readonly cols?: number

    readonly event_value_change?: (value: string) => void
    readonly event_value_change_valid?: (value: string) => void
}

export const EPInTextArea_Area = r.forwardRef<HTMLTextAreaElement, EPInTextArea__Area_Props>((props, f_ref) => {
    const nprop_value_comparator = props.value_comparator ?? Object.is

    const l_ref = r.useRef<HTMLTextAreaElement | null>(null)
    const ref = useRefMerge(f_ref, l_ref)

    const value_default = r.useMemo(() => props.value_default, [])

    // only used for value_default
    const [state_error, state_error_set] = r.useState(() => {
        if (props.value_validator) {
            const initvalue = value_default

            if (typeof initvalue === "string") {
                return props.value_validator(initvalue)
            }
        }

        return false
    })

    r.useLayoutEffect(() => {
        const input = l_ref.current

        if (input && !nprop_value_comparator(props.value_default, input.value)) {
            input.value = props.value_default

            if (props.value_validator) {
                state_error_set(!props.value_validator(props.value_default))
            }
        }
    }, [props.value_default, nprop_value_comparator])

    r.useLayoutEffect(() => {
        const textarea = l_ref.current

        if (textarea) {
            const now_value = textarea.value

            if (props.value_validator) {
                state_error_set(!props.value_validator(now_value))
            } else {
                state_error_set(false)
            }
        }
    }, [props.value_validator])

    return <textarea
        ref={ref}

        id={props.id}
        rows={props.rows}
        cols={props.cols}
        defaultValue={value_default}
        disabled={props.state_disabled}
        placeholder={props.placeholder}

        className={cl(
            st.intextarea__area,
            props.stmod?.view,
            state_error && props.stmod?._error,
            props.state_disabled && props.stmod?._disabled,
            props.className,
        )}

        onChange={ev => {
            props.event_value_change?.(ev.target.value)

            if (props.event_value_change_valid) {
                if (props.value_validator) {
                    const value_valid = props.value_validator(ev.target.value)

                    state_error_set(!value_valid)

                    if (value_valid) {
                        props.event_value_change_valid(ev.target.value)
                    }
                } else {
                    props.event_value_change_valid(ev.target.value)
                }
            } else {
                if (props.value_validator && typeof props.value_default === "string") {
                    state_error_set(!props.value_validator(ev.target.value))
                }
            }
        }}
    />
})

export default EPInTextArea_Area
