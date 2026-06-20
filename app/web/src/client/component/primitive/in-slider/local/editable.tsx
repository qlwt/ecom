import type { FnSetterStateful } from "@qyu/reactcmp-dropdown"
import st from "@src/client/component/primitive/in-slider/style/core.module.scss"
import cl from "classnames"
import * as r from "react"
import * as rfl from "@qyu/reactcmp-flow-control"

export type ELInSlider__Editable_Api = {
    readonly status_edit: boolean
    readonly status_edit_set: FnSetterStateful<boolean>
}

export type ELInSlider__Editable_Props<K extends keyof r.JSX.IntrinsicElements> = {
    readonly enabled: boolean
    readonly input_default: string

    readonly render_container: (props: r.JSX.IntrinsicElements["div"]) => r.ReactNode
    readonly render_main: (props: r.JSX.IntrinsicElements[K], api: ELInSlider__Editable_Api) => r.ReactNode
    readonly render_input: (props: r.JSX.IntrinsicElements["input"], api: ELInSlider__Editable_Api) => r.ReactNode
}

export const ELInSlider_Editable = function <K extends keyof r.JSX.IntrinsicElements>(props: ELInSlider__Editable_Props<K>) {
    const ref_input = r.useRef<HTMLInputElement | null>(null)

    const [edit, edit_set] = r.useState(false)

    const input_default = r.useMemo(() => props.input_default, [edit])

    const api = {
        status_edit: edit,
        status_edit_set: edit_set,
    } satisfies ELInSlider__Editable_Api

    r.useEffect(() => {
        if (edit) {
            const input = ref_input.current

            if (input) {
                input.focus()
                input.value = input_default
            }
        }
    }, [edit])

    return props.render_container({
        className: cl(st.merge),

        children: <>
            {props.render_main({
                className: cl(st.merge__item, edit && st._hidden)
            }, api)}

            <rfl.CmpIf value={props.enabled}>
                {() => props.render_input({
                    className: cl(st.merge__item, !edit && st._hidden),
                    ref: ref_input,
                    defaultValue: "",

                    onKeyDown: ev => {
                        switch (ev.key.toLowerCase()) {
                            case "enter":
                            case "escape": {
                                if (!ev.altKey && !ev.shiftKey && !ev.ctrlKey && !ev.metaKey) {
                                    edit_set(false)
                                }

                                break
                            }
                        }
                    },

                    onBlur: () => {
                        edit_set(false)
                    },
                }, api)}
            </rfl.CmpIf>
        </>
    })
}
