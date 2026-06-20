import { ELConEdit_MarkState } from "@src/client/component/feature/console-edit/local/mark_state"
import st from "@src/client/component/feature/console-edit/style/mark.module.scss"
import { useRefMerge } from "@src/client/hook/ref/merge"
import cl from "classnames"
import * as r from "react"

export type ELConEdit__MarkInput_Props = {
    readonly id: string
    readonly type: NonNullable<r.JSX.IntrinsicElements["input"]["type"]>

    readonly value: string
    readonly value_set: (id: string, label: string) => void

    readonly className?: string
    readonly autofocus?: boolean
    readonly children?: r.ReactNode
}

export const ELConEdit_MarkInput = r.forwardRef<HTMLInputElement, ELConEdit__MarkInput_Props>((props, f_ref) => {
    const l_ref = r.useRef<HTMLInputElement | null>(null)

    const state = r.useContext(ELConEdit_MarkState)

    if (!state) { throw new Error(`Trying to use ELConEdit_MarkInput outside of ELConEdit_MarkState`) }

    const ref = useRefMerge(l_ref, f_ref)

    r.useEffect(() => {
        if (state.open && props.autofocus) {
            l_ref.current?.focus()
        }
    }, [state.open, props.autofocus])

    return <input
        ref={ref}

        type={props.type}
        value={props.value}
        className={cl(st.view__item, st.input)}

        onKeyDown={ev => {
            if (ev.altKey === false && ev.ctrlKey === false && ev.shiftKey === false && ev.metaKey === false) {
                switch (ev.key.toLowerCase()) {
                    case "escape":
                    case "enter": {
                        if (ev.currentTarget instanceof HTMLElement) {
                            ev.currentTarget.blur()
                        }

                        break
                    }
                }
            }
        }}

        onChange={ev => {
            props.value_set(props.id, ev.currentTarget.value)
        }}
    />
})
