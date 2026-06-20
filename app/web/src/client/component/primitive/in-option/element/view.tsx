import st from "@client/component/primitive/in-option/style/core.module.scss"
import * as ddn from "@qyu/reactcmp-dropdown"
import EPInOption_Head from "@src/client/component/primitive/in-option/local/head"
import ELInOption_ListContent from "@src/client/component/primitive/in-option/local/list_content"
import { domroot_dropdown } from "@src/client/const/domroot"
import { useRefO } from "@src/client/hook/ref/o"
import type { FnSetterStateles } from "@src/client/type/fns"
import cl from "classnames"
import * as r from "react"

export type EPInOption__View_Props<T> = {
    readonly mask?: string
    readonly placeholder: string
    readonly kind_search: boolean
    readonly status_disabled?: boolean
    readonly theme?: { readonly [K in string]: string }

    readonly option_list: readonly T[]
    readonly option_selection: readonly [T] | null
    readonly option_selection_set: FnSetterStateles<T>

    readonly option_key_new: (option: T) => any
    readonly option_name_new: (option: T) => string
}

const fallback_theme: EPInOption__View_Props<any>["theme"] = {}

export const EPInOption_View = function <T>(props: EPInOption__View_Props<T>): r.ReactNode {
    const nprop_theme = props.theme ?? fallback_theme
    const nprop_status_disabled = props.status_disabled ?? false

    const ref_list = r.useRef<HTMLDivElement | null>(null)

    const ref_head = r.useRef<HTMLButtonElement | null>(null)
    const refo_head = useRefO(ref_head)

    const ref_search = r.useRef<HTMLInputElement | null>(null)
    const refo_search = useRefO(ref_search)

    const ref_content = r.useRef<HTMLDivElement | null>(null)
    const refo_content = useRefO(ref_content)

    const [open, open_set] = r.useState(false)
    const [option_height, option_height_set] = r.useState(0)

    const [search, search_set] = r.useState(() => {
        return (props.option_selection
            ? props.option_name_new(props.option_selection[0])
            : ""
        )
    })

    r.useLayoutEffect(() => {
        const search = ref_search.current
        const head = ref_head.current

        if (search && head && props.kind_search) {
            if (open && !props.status_disabled) {
                search.focus()
            } else {
                const content = refo_content()

                if (content) {
                    if (
                        document.activeElement === document.body
                        || head.contains(document.activeElement)
                        || content.contains(document.activeElement)
                    ) {
                        head.focus()
                    }
                }
            }
        }
    }, [props.kind_search, open, props.status_disabled, refo_content, refo_head])

    r.useLayoutEffect(() => {
        const controller_abort = new AbortController()

        const evaluate = () => {
            const list = ref_list.current

            if (list) {
                const list_computed = window.getComputedStyle(list)
                const doc_computed = window.getComputedStyle(window.document.documentElement)

                const doc_fontsize = Number.parseFloat(doc_computed.fontSize)
                // expected to be in rem
                const list_fontsize = Number.parseFloat(list_computed.getPropertyValue("--inoption-option-font_size"))
                const list_lineheight = Number.parseFloat(list_computed.getPropertyValue("--inoption-option-line_height"))
                const list_padding_ver = Number.parseFloat(list_computed.getPropertyValue("--inoption-option-padding_ver"))

                option_height_set(Math.fround(
                    list_fontsize * list_lineheight * doc_fontsize
                    + list_padding_ver * 2 * doc_fontsize
                ))
            }
        }

        evaluate()

        window.addEventListener("resize", evaluate, { signal: controller_abort.signal })

        return () => {
            controller_abort.abort()
        }
    }, [])

    r.useLayoutEffect(() => {
        if (props.option_selection) {
            const option_name = props.option_name_new(props.option_selection[0])

            search_set(option_name)
        } else {
            search_set("")
        }
    }, [props.option_selection, props.option_name_new, props.kind_search])

    return <ddn.CmpContainerVirtual
        open_set={open_set}
        open={open && !props.status_disabled}

        focus={{
            capture: !props.kind_search,
            restore: false,
        }}
    >
        <ddn.CmpButtonVirtual target={refo_head}>
            <EPInOption_Head
                ref_search={ref_search}
                ref_container={ref_head}

                refo_content={refo_content}

                theme={nprop_theme}
                kind_search={props.kind_search}

                mask={props.mask}
                placeholder={props.placeholder}

                state_open={open}
                state_open_set={open_set}

                state_search={search}
                state_search_set={search_set}

                status_disabled={nprop_status_disabled}
                status_empty={props.option_selection === null}
            />
        </ddn.CmpButtonVirtual>

        <ddn.CmpListPortal
            ref={ref_list}

            gap={1}
            stretch={`strict`}
            portal={domroot_dropdown}
            measurement_kind={`precise`}
            rearrange={{ deps: [search] }}
            className={cl(st.list, nprop_theme.list)}
        >
            {() => <ELInOption_ListContent
                ref_content={ref_content}

                refo_head={refo_head}
                refo_search={refo_search}

                theme={nprop_theme}
                kind_search={props.kind_search}

                state_search={search}
                state_open_set={open_set}

                option_height={option_height}
                option_list={props.option_list}
                option_selection={props.option_selection}
                option_selection_set={props.option_selection_set}

                option_key_new={props.option_key_new}
                option_name_new={props.option_name_new}
            />}
        </ddn.CmpListPortal>
    </ddn.CmpContainerVirtual>
}

export default EPInOption_View
