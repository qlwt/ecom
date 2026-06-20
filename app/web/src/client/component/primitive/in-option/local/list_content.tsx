import * as r from "react"
import * as ddn from "@qyu/reactcmp-dropdown"
import type { FnSetterStateful, FnSetterStateles } from "@src/client/type/fns"
import st from "@client/component/primitive/in-option/style/core.module.scss"
import cl from "classnames"
import EPVList_View from "@src/client/component/primitive/vlist/element"
import ELInOption_Option from "@src/client/component/primitive/in-option/local/option"
import { ref_use } from "@src/client/util/ref/use"

export type ELInOption__ListContent_Props<T> = {
    readonly refo_head: () => HTMLElement | null
    readonly refo_search: () => HTMLElement | null
    readonly ref_content: r.RefObject<HTMLDivElement | null>

    readonly kind_search: boolean
    readonly theme: { readonly [K in string]: string }

    readonly state_search: string
    readonly state_open_set: FnSetterStateful<boolean>

    readonly option_height: number
    readonly option_list: readonly T[]
    readonly option_selection: readonly [T] | null
    readonly option_selection_set: FnSetterStateles<T>

    readonly option_key_new: (option: T) => any
    readonly option_name_new: (option: T) => string
}

export const ELInOption_ListContent = function <T>(props: ELInOption__ListContent_Props<T>): r.ReactNode {
    const match_options = r.useMemo(() => {
        const search_clean = props.state_search.trim().toLowerCase()

        if (props.kind_search && search_clean.length > 0) {
            const result: T[] = []
            const search_words = search_clean.split(/\s+/g)
            const selection_name = (props.option_selection && props.option_name_new(props.option_selection[0])) ?? null

            if (selection_name?.toLowerCase() === search_clean) {
                return props.option_list
            }

            for (const option of props.option_list) {
                const option_name = props.option_name_new(option).toLowerCase()

                if (search_words.every(word => option_name.includes(word))) {
                    result.push(option)
                }
            }

            if (result.length === 0) {
                return props.option_list
            }

            return result
        }

        return props.option_list
    }, [
        props.option_list,
        props.state_search,
        props.kind_search,
        props.option_selection,
        props.option_name_new
    ])

    const option_selection_key = r.useMemo(() => {
        if (props.option_selection) {
            return props.option_key_new(props.option_selection[0])
        }

        return null
    }, [props.option_selection, props.option_key_new])

    return <EPVList_View
        row_gap={0}
        row_length={1}
        row_height={props.option_height}
        grid_padding={0}
        window_buffer={2}
        src_length={match_options.length}

        src_render={index => {
            const option_node = match_options[index]!
            const option_key = props.option_key_new(option_node)

            return <ELInOption_Option
                key={option_key}

                theme={props.theme}
                state_open_set={props.state_open_set}
                status_selected={option_selection_key === option_key}

                option_node={option_node}
                option_name_new={props.option_name_new}
                option_selection_set={props.option_selection_set}
            />
        }}

        grid_render={children => {
            return <div className={cl(st.list__grid, props.theme.list__grid)}>
                {children}
            </div>
        }}

        container_render={l_props => {
            return <ddn.CmpContent
                ref={props.ref_content}

                focus_noguards
                className={cl(st.list__content, props.theme.list__content)}

                render_view={l_l_props => {
                    return <div
                        {...l_props}
                        {...l_l_props}

                        ref={element => {
                            if (l_props.ref) {
                                ref_use(l_props.ref, element)
                            }

                            if (l_l_props.ref) {
                                ref_use(l_l_props.ref, element)
                            }
                        }}

                        children={l_props.children ?? l_l_props.children}
                        className={cl(l_props.className, l_l_props.className)}

                        onKeyDown={ev => {
                            l_props.onKeyDown?.(ev)
                            l_l_props.onKeyDown?.(ev)

                            if (ev.key.toLowerCase() === "tab" && ev.shiftKey && ev.target === ev.currentTarget) {
                                if (props.kind_search) {
                                    const search = props.refo_search()

                                    if (search) {
                                        ev.preventDefault()

                                        search.focus()
                                    }
                                } else {
                                    const head = props.refo_head()

                                    if (head) {
                                        ev.preventDefault()

                                        head.focus()
                                    }
                                }
                            }
                        }}
                    />
                }}
            />
        }}
    />
}

export default ELInOption_ListContent
