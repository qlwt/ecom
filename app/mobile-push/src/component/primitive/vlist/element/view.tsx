import { epvlist__stf_core as st } from "@/src/component/primitive/vlist/style/core"
import * as gs from "@fst/gstate"
import * as rfl from "@qyu/reactcmp-flow-control"
import * as r from "react"
import * as rn from "react-native"

export type EPVList__View_Pagination = {
    readonly load: VoidFunction
    readonly threashhold: number
    readonly status: gs.PaginatorList_Status
}

export type EPVList__View_Props = {
    readonly items_length: number
    readonly items_render: (index: number) => r.ReactNode

    readonly list_vpad: number
    readonly list_vgap: number
    readonly list_hcap: number
    readonly list_vbuff: number
    readonly list_rowheight: number
    readonly list_render: (props: rn.ViewProps) => r.ReactNode

    readonly scroll_render: (props: rn.ScrollViewProps) => r.ReactNode

    readonly pagination?: EPVList__View_Pagination
}

export const EPVList_View: r.FC<EPVList__View_Props> = props => {
    const ref_scroll = r.useRef<number>(0)
    const ref_height = r.useRef<number>(0)

    const [render_end, render_end_set] = r.useState<number>(0)
    const [render_start, render_start_set] = r.useState<number>(0)

    const list_length = r.useMemo(() => {
        return Math.ceil(props.items_length / props.list_hcap)
    }, [props.items_length, props.list_hcap])

    const el_cards = r.useMemo(() => {
        const elements: r.ReactNode[] = []

        const line_start = Math.max(render_start - props.list_vbuff, 0)
        const line_end = Math.min(render_end + props.list_vbuff, list_length)

        const node_start = Math.min(props.items_length, line_start * props.list_hcap)
        const node_end = Math.min(props.items_length, line_end * props.list_hcap)

        for (let i = node_start; i < node_end; ++i) {
            elements.push(props.items_render(i))
        }

        return elements
    }, [render_start, render_end, list_length, props.items_length, props.items_render, props.list_hcap, props.list_vbuff])

    const space_up = r.useMemo(() => {
        const lines_up = Math.max(0, render_start - props.list_vbuff)

        return props.list_rowheight * lines_up + props.list_vgap * lines_up
    }, [render_start, props.list_vbuff, props.list_rowheight, props.list_vgap])

    const space_down = r.useMemo(() => {
        const lines_down = list_length - Math.min(list_length, render_end + props.list_vbuff)

        return lines_down * props.list_rowheight + props.list_vgap * lines_down
    }, [render_end, list_length, props.list_vbuff, props.list_rowheight, props.list_vgap])

    r.useLayoutEffect(() => {
        const container_height = ref_height.current
        const container_scrolly = ref_scroll.current - props.list_vpad

        const rwindow_start = Math.floor((container_scrolly + props.list_vgap) / (props.list_rowheight + props.list_vgap))

        const now_space_up = (rwindow_start * props.list_rowheight + rwindow_start * props.list_vgap)
        const now_window_height = Math.max(0, container_scrolly + container_height - now_space_up)
        const rwindow_end = rwindow_start + Math.ceil((now_window_height + props.list_vgap) / (props.list_rowheight + props.list_vgap))

        render_end_set(rwindow_end)
        render_start_set(rwindow_start)
    }, [props.list_rowheight, props.list_vgap, props.list_hcap, props.list_vpad, props.items_length])

    r.useEffect(() => {
        const pag = props.pagination

        if (pag && pag.status === gs.PaginatorList_Status.Idle && list_length - render_end <= pag.threashhold) {
            pag.load()
        }
    }, [render_end, list_length, props.pagination?.load, props.pagination?.status, props.pagination?.threashhold])

    return props.scroll_render({
        style: st.scroll(),

        onLayout: event => {
            ref_height.current = event.nativeEvent.layout.height

            const container_height = ref_height.current
            const container_scrolly = ref_scroll.current - props.list_vpad

            const rwindow_start = Math.floor((container_scrolly + props.list_vgap) / (props.list_rowheight + props.list_vgap))

            const now_space_up = (rwindow_start * props.list_rowheight + rwindow_start * props.list_vgap)
            const now_window_height = Math.max(0, container_scrolly + container_height - now_space_up)
            const rwindow_end = rwindow_start + Math.ceil((now_window_height + props.list_vgap) / (props.list_rowheight + props.list_vgap))

            render_end_set(rwindow_end)
            render_start_set(rwindow_start)
        },

        onScroll: event => {
            ref_scroll.current = event.nativeEvent.contentOffset.y

            const container_height = ref_height.current
            const container_scrolly = ref_scroll.current - props.list_vpad

            const rwindow_start = Math.floor((container_scrolly + props.list_vgap) / (props.list_rowheight + props.list_vgap))

            const now_space_up = (rwindow_start * props.list_rowheight + rwindow_start * props.list_vgap)
            const now_window_height = Math.max(0, container_scrolly + container_height - now_space_up)
            const rwindow_end = rwindow_start + Math.ceil((now_window_height + props.list_vgap) / (props.list_rowheight + props.list_vgap))

            render_end_set(rwindow_end)
            render_start_set(rwindow_start)
        },

        children: <>
            <rn.View style={st.placeholder({ height: space_up })} />

            {props.list_render({
                style: st.list(),

                children: <>
                    {el_cards}
                </>
            })}

            <rn.View style={st.placeholder({ height: space_down })} />

            <rfl.CmpIf value={props.pagination?.status === gs.PaginatorList_Status.Pending}>
                <rn.View style={st.pending({ height: props.list_rowheight })}>
                    <rn.ActivityIndicator size="large" />
                </rn.View>
            </rfl.CmpIf>
        </>,
    })
}

export default EPVList_View
