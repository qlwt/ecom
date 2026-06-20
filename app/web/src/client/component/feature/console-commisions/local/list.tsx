import * as cc from "@fst/config/client"
import * as gs from "@fst/gstate"
import * as asr from "@qyu/atom-state-react"
import * as rfl from "@qyu/reactcmp-flow-control"
import * as sc from "@qyu/signal-core"
import * as sr from "@qyu/signal-react"
import ELConCommisions_CardCommision from "@src/client/component/feature/console-commisions/local/card_commision"
import st from "@src/client/component/feature/console-commisions/style/list.module.scss"
import type { EFConCommisions__PaginatorNew_DataNode, EFConCommisions__PaginatorNew_Paginator } from "@src/client/component/feature/console-commisions/util/paginator_new"
import EPPending_Spinner, { EPPending_Spinner_Size } from "@src/client/component/primitive/pending/element/spinner"
import * as r from "react"

type ParsedNode = cc.RemDef["commision"]["joins"]["core"]

const batchsize = 20

type EL_Grid_Props = {
    readonly paginator_nodes: readonly ParsedNode[]
    readonly paginator_status: gs.PaginatorList_Status
    readonly paginator_data: sc.Signal<readonly EFConCommisions__PaginatorNew_DataNode[]>
}

const EL_Grid: r.FC<EL_Grid_Props> = props => {
    const l_actions = 0

    const l_loading = r.useMemo(() => {
        return 0
    }, [props.paginator_status])

    return <>
        <div className={st.list}>
            <rfl.CmpRepeat repeat={l_actions + l_loading + props.paginator_nodes.length}>
                {i => {
                    if ((i -= l_actions) < props.paginator_nodes.length) {
                        const node = props.paginator_nodes[i]!

                        return <ELConCommisions_CardCommision
                            key={node.id}
                            node={node}
                        />
                    }

                    throw new Error("out of range")
                }}
            </rfl.CmpRepeat>
        </div>

        <rfl.CmpIf value={props.paginator_status !== gs.PaginatorList_Status.Fulfilled}>
            <div className={st.pendingpanel}>
                <EPPending_Spinner size={EPPending_Spinner_Size.Big} />
            </div>
        </rfl.CmpIf>
    </>
}

export type ELConCommisions__List_Props = {
    readonly paginator: EFConCommisions__PaginatorNew_Paginator
}

export const ELConCommisions_List: r.FC<ELConCommisions__List_Props> = props => {
    const ref_container = r.useRef<HTMLDivElement | null>(null)

    const paginator_status = sr.useSignalOutput(props.paginator.status)

    const paginator_data = asr.useAtomConnect(r.useMemo(() => {
        return ({ reg }) => {
            return sc.osignal_new_memo(sc.osignal_new_pipe(
                sc.osignal_new_pipeflat(
                    sc.osignal_new_listpipe(props.paginator.data, node => {
                        return sc.osignal_new_memo(
                            sc.osignal_new_pipe(
                                reg(gs.rem.commision.joins.core())({
                                    id: node.statics.id
                                }),
                                join => {
                                    return join?.data ?? null
                                }
                            )
                        )
                    }),
                    nodes => {
                        return sc.osignal_new_merge(nodes)
                    }
                ),
                m => m.filter(n => n !== null) || []
            ))
        }
    }, [props.paginator.data]))

    r.useEffect((): VoidFunction | void => {
        if (paginator_status === gs.PaginatorList_Status.Idle) {
            const updator = () => {
                const container = ref_container.current

                if (container) {
                    const container_box = container.getBoundingClientRect()

                    if (container_box.y + container_box.height - window.innerHeight < 800) {
                        props.paginator.load(batchsize)
                    }
                }
            }

            window.addEventListener("resize", updator)
            window.addEventListener("scroll", updator)

            updator()

            return () => {
                window.addEventListener("resize", updator)
                window.removeEventListener("scroll", updator)
            }
        }
    }, [props.paginator, paginator_data, paginator_status])


    return <div ref={ref_container} className={st.container}>
        <rfl.CmpRequire value={[paginator_data.value] as const}>
            {([paginator_nodes]) => <EL_Grid
                paginator_nodes={paginator_nodes}
                paginator_status={paginator_status}
                paginator_data={props.paginator.data}
            />}
        </rfl.CmpRequire>
    </div>
}

export default ELConCommisions_List
