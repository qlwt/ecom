import * as gs from "@fst/gstate"
import st from "@src/client/component/primitive/selectlist/style/core.module.scss"
import EPVList_View from "@src/client/component/primitive/vlist/element"
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

type GridVariables = {
    readonly grid_padver: number
    readonly grid_padhor: number

    readonly grid_rowgap: number
    readonly grid_colgap: number

    readonly grid_col: number
    readonly grid_row: number
}

const grid_variables_new = function(element_new: () => HTMLDivElement | null): GridVariables {
    const element = element_new()

    if (element) {
        const element_computed = getComputedStyle(element)
        const document_computed = getComputedStyle(document.documentElement)

        const document_fontsize = Number.parseFloat(document_computed.getPropertyValue("font-size"))

        return {
            grid_col: Number.parseFloat(element_computed.getPropertyValue("--grid-col")) * document_fontsize,
            grid_row: Number.parseFloat(element_computed.getPropertyValue("--grid-row")) * document_fontsize,
            grid_rowgap: Number.parseFloat(element_computed.getPropertyValue("--grid-rowgap")) * document_fontsize,
            grid_colgap: Number.parseFloat(element_computed.getPropertyValue("--grid-colgap")) * document_fontsize,
            grid_padver: Number.parseFloat(element_computed.getPropertyValue("--grid-padver")) * document_fontsize,
            grid_padhor: Number.parseFloat(element_computed.getPropertyValue("--grid-padhor")) * document_fontsize,
        }
    }

    return {
        grid_col: 0,
        grid_row: 0,
        grid_rowgap: 0,
        grid_colgap: 0,
        grid_padver: 0,
        grid_padhor: 0,
    }
}

export type ELPSelectList__Grid_Props = {
    readonly src_length: number
    readonly paginator_load: () => void
    readonly paginator_status: gs.PaginatorList_Status
    readonly src_render: (index: number) => r.ReactNode
}

export const ELPSelectList_Grid: r.FC<ELPSelectList__Grid_Props> = props => {
    const ref_list = r.useRef<HTMLDivElement | null>(null)
    const grid_size = useSize(useRefO(ref_list))
    const [variables, variables_set] = r.useState(() => grid_variables_new(() => ref_list.current))

    r.useLayoutEffect(() => {
        const listener = () => {
            variables_set(grid_variables_new(() => ref_list.current))
        }

        window.addEventListener("resize", listener)

        listener()

        return () => {
            window.addEventListener("resize", listener)
        }
    }, [])

    const row_length = Math.floor(
        (Math.max(0, (grid_size?.width ?? 0) - variables.grid_padhor * 2) + variables.grid_colgap)
        / (variables.grid_col + variables.grid_colgap)
    )

    return <EPVList_View
        window_buffer={1}
        row_length={row_length}
        row_gap={variables.grid_rowgap}
        row_height={variables.grid_row}

        src_length={props.src_length}
        src_render={props.src_render}

        grid_padding={variables.grid_padver}
        grid_render={children => <div ref={ref_list} className={st.list}>
            {children}
        </div>}

        pagination={{
            load: props.paginator_load,
            status: props.paginator_status,
            threashhold: 0,
        }}
    >
    </EPVList_View>
}
