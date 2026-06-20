import st from "@client/component/primitive/vlist/style/index.module.scss"
import * as gs from "@fst/gstate"
import * as rfl from "@qyu/reactcmp-flow-control"
import EPPending_Spinner, { EPPending_Spinner_Size } from "@src/client/component/primitive/pending/element/spinner"
import { useRefO } from "@src/client/hook/ref/o"
import * as r from "react"

const useSize = function(ref_node: () => HTMLElement | null) {
    const [size, size_set] = r.useState<DOMRect | null>(null)

    r.useEffect((): VoidFunction | void => {
        const node = ref_node()

        if (node) {
            const observer = new ResizeObserver(() => {
                size_set(node.getBoundingClientRect())
            })

            observer.observe(node)

            return () => {
                observer.disconnect()
            }
        }
    })

    return size
}

export type EPVList__View_Pagination = {
    readonly load: VoidFunction
    readonly threashhold: number
    readonly status: gs.PaginatorList_Status
}

export type EPVList__View_Props = {
    readonly window_buffer: number

    readonly src_length: number
    readonly src_render: (index: number) => r.ReactNode

    readonly grid_padding: number
    readonly grid_render: (children: r.ReactNode) => r.ReactNode

    readonly container_render?: (props: r.JSX.IntrinsicElements["div"]) => r.ReactNode

    readonly row_gap: number
    readonly row_height: number
    readonly row_length: number
    readonly pagination?: EPVList__View_Pagination
}

const def_container_render: NonNullable<EPVList__View_Props["container_render"]> = props => {
    return <div {...props} />
}

export const EPVList_View: r.FC<EPVList__View_Props> = props => {
    const loc_container_render = props.container_render || def_container_render

    const ref_container = r.useRef<HTMLDivElement | null>(null)
    const container_size = useSize(useRefO(ref_container))
    const [render_end, render_end_set] = r.useState(0)
    const [render_start, render_start_set] = r.useState(0)

    const grid_length = r.useMemo(() => {
        return Math.ceil(props.src_length / props.row_length)
    }, [props.src_length, props.row_length])

    const padding_top = r.useMemo(() => {
        const rwindow_first = Math.max(0, render_start - props.window_buffer)

        // should calculate row_gap including gap from last invisible row to first visible, so no -1
        return (
            + rwindow_first * props.row_gap
            + rwindow_first * props.row_height
        )
    }, [render_start, props.row_height, props.row_gap, grid_length, props.window_buffer])

    const padding_bottom = r.useMemo(() => {
        const rwindow_end = Math.min(grid_length, render_end + props.window_buffer)

        const bottom_length = grid_length - rwindow_end

        // should calculate row gap between last visible row and first invisible, so no -1
        return (
            + bottom_length * props.row_height
            + bottom_length * props.row_gap
        )
    }, [render_end, props.row_height, props.row_gap, grid_length])

    const element_items = r.useMemo(() => {
        const result: r.ReactNode[] = []
        const rwindow_first = Math.max(0, render_start - props.window_buffer)
        const rwindow_end = Math.min(grid_length, render_end + props.window_buffer)

        for (let i = rwindow_first * props.row_length; i < Math.min(props.src_length, rwindow_end * props.row_length); ++i) {
            result.push(props.src_render(i))
        }

        return result
    }, [render_start, render_end, props.window_buffer, grid_length, props.row_length, props.src_length, props.src_render])

    const element_grid = r.useMemo(() => {
        return props.grid_render(element_items)
    }, [element_items, props.grid_render])

    r.useLayoutEffect(() => {
        const container = ref_container.current

        if (!container) {
            return
        }

        const content_scroll = Math.max(0, container.scrollTop - props.grid_padding)
        const now_render_start = Math.max(0, Math.floor((content_scroll + props.row_gap) / (props.row_height + props.row_gap)))

        if (container_size) {
            // calculate padding top for new rwindow to avoid zombie render
            const now_padding_top = (
                + now_render_start * props.row_gap
                + now_render_start * props.row_height
            )

            const content_height = Math.max(0, container_size.height + content_scroll - now_padding_top)
            const now_render_end = Math.min(grid_length, now_render_start + Math.ceil((content_height + props.row_gap) / (props.row_height + props.row_gap)))

            render_start_set(now_render_start)
            render_end_set(now_render_end)
        } else {
            render_start_set(now_render_start)
            render_end_set(now_render_start)
        }
    }, [container_size, props.grid_padding, props.row_gap, props.row_height, grid_length])

    r.useEffect(() => {
        const pag = props.pagination

        if (pag) {
            if (pag.status === gs.PaginatorList_Status.Idle && grid_length - render_end <= pag.threashhold) {
                pag.load()
            }
        }
    }, [grid_length, render_end, props.pagination?.threashhold, props.pagination?.load, props.pagination?.status])

    return loc_container_render({
        ref: ref_container,
        className: st.view,

        onScroll: event => {
            const scroll_y = Math.max(0, Math.min(event.currentTarget.scrollTop) - props.grid_padding)
            const now_render_start = Math.floor((scroll_y + props.row_gap) / (props.row_height + props.row_gap))

            if (container_size) {
                // calculate padding top for new render to avoid zombie render
                const now_padding_top = (
                    + now_render_start * props.row_gap
                    + now_render_start * props.row_height
                )

                const content_height = Math.max(0, container_size.height + scroll_y - now_padding_top)
                const now_render_end = now_render_start + Math.ceil((content_height + props.row_gap) / (props.row_height + props.row_gap))

                render_start_set(now_render_start)
                render_end_set(now_render_end)
            } else {
                render_start_set(now_render_start)
                render_end_set(now_render_start)
            }
        },

        children: <>
            <div className={st.placeholder} style={{ height: `${padding_top}px` }} />

            {element_grid}

            <div className={st.placeholder} style={{ height: `${padding_bottom}px` }} />

            <rfl.CmpIf value={props.pagination?.status === gs.PaginatorList_Status.Pending}>
                <div className={st.pending} style={{ height: `${props.row_height}px` }}>
                    <EPPending_Spinner size={EPPending_Spinner_Size.Normal} />
                </div>
            </rfl.CmpIf>
        </>
    })
}

export default EPVList_View
