import * as gs from "@fst/gstate"
import * as asr from "@qyu/atom-state-react"
import * as rfl from "@qyu/reactcmp-flow-control"
import * as sc from "@qyu/signal-core"
import * as sr from "@qyu/signal-react"
import { EFCon_NodeKind } from "@src/client/component/feature/console/cst/NodeKind"
import { ELCon_CardItem } from "@src/client/component/feature/console/local/card-item"
import { ELCon_CardMaterial } from "@src/client/component/feature/console/local/card-material"
import { ELCon_CardTmplIt } from "@src/client/component/feature/console/local/card-tmplit"
import { ELCon_CardTmplMt } from "@src/client/component/feature/console/local/card-tmplmt"
import { ELCon_CardTmplPr } from "@src/client/component/feature/console/local/card-tmplpr"
import st from "@src/client/component/feature/console/style/list.module.scss"
import type { EFCon_Paginator, EFCon_Paginator__DataNode } from "@src/client/component/feature/console/type/paginator"
import EPPending_Spinner, { EPPending_Spinner_Size } from "@src/client/component/primitive/pending/element/spinner"
import cl from "classnames"
import * as r from "react"

type ParsedNode = (
    | {
        readonly kind: EFCon_NodeKind.Item
        readonly node: gs.Rem_Join<"item", "core"> | null
    }
    | {
        readonly kind: EFCon_NodeKind.Material
        readonly node: gs.Rem_Join<"material", "core"> | null
    }
    | {
        readonly kind: EFCon_NodeKind.ItemTemplate
        readonly node: gs.Rem_Join<"tmplit", "core"> | null
    }
    | {
        readonly kind: EFCon_NodeKind.MaterialTemplate
        readonly node: gs.Rem_Join<"tmplmt", "core"> | null
    }
    | {
        readonly kind: EFCon_NodeKind.ProductTemplate
        readonly node: gs.Rem_Join<"tmplpr", "core"> | null
    }
)

const batchsize = 20

type EL_CardView_Props = {
    readonly paginator_kind: EFCon_NodeKind
    readonly paginator_noderef: ParsedNode
    readonly paginator_status: gs.PaginatorList_Status
    readonly paginator_data: sc.Signal<readonly EFCon_Paginator__DataNode[], readonly EFCon_Paginator__DataNode[]>
}

const EL_CardView: r.FC<EL_CardView_Props> = props => {
    const noderef = props.paginator_noderef

    switch (noderef.kind) {
        case EFCon_NodeKind.Item: {
            const node = noderef.node

            if (node && node.data) {
                return <ELCon_CardItem
                    key={`item:card:${node.data.id}`}

                    node={node.data}

                    event_addnode={ev_node => {
                        props.paginator_data.input([
                            {
                                kind: EFCon_NodeKind.Item,
                                node: ev_node,
                            },

                            ...props.paginator_data.output()
                        ])
                    }}
                />
            }

            return null
        }
        case EFCon_NodeKind.Material: {
            const node = noderef.node

            if (node && node.data) {
                return <ELCon_CardMaterial
                    key={`material:card:${node.data.id}`}

                    node={node.data}
                />
            }

            return null
        }
        case EFCon_NodeKind.ItemTemplate: {
            const node = noderef.node

            if (node && node.data) {
                return <ELCon_CardTmplIt
                    key={`tmplit:card:${node.data.id}`}

                    node={node.data}
                />
            }

            return null
        }
        case EFCon_NodeKind.MaterialTemplate: {
            const node = noderef.node

            if (node && node.data) {
                return <ELCon_CardTmplMt
                    key={`tmplmt:card:${node.data.id}`}

                    node={node.data}
                />
            }

            return null
        }
        case EFCon_NodeKind.ProductTemplate: {
            const node = noderef.node

            if (node && node.data) {
                return <ELCon_CardTmplPr
                    key={`tmplpr:card:${node.data.id}`}

                    node={node.data}
                />
            }

            return null
        }
    }

    return null
}

type EL_Grid_Props = {
    readonly paginator_kind: EFCon_NodeKind
    readonly paginator_nodes: readonly ParsedNode[]
    readonly paginator_status: gs.PaginatorList_Status
    readonly paginator_data: sc.Signal<readonly EFCon_Paginator__DataNode[], readonly EFCon_Paginator__DataNode[]>
}

const EL_Grid: r.FC<EL_Grid_Props> = props => {
    const l_actions = 0

    const l_loading = r.useMemo(() => {
        return 0
    }, [props.paginator_status])

    return <>
        <div className={cl(st.list, {
            [st.list_item!]: props.paginator_kind === EFCon_NodeKind.Item,
            [st.list_material!]: props.paginator_kind === EFCon_NodeKind.Material,
            [st.list_tmplit!]: props.paginator_kind === EFCon_NodeKind.ItemTemplate,
            [st.list_tmplpr!]: props.paginator_kind === EFCon_NodeKind.ProductTemplate,
            [st.list_tmplmt!]: props.paginator_kind === EFCon_NodeKind.MaterialTemplate,
        })}>
            <rfl.CmpRepeat repeat={l_actions + l_loading + props.paginator_nodes.length}>
                {i => {
                    if ((i -= l_actions) < props.paginator_nodes.length) {
                        const data = props.paginator_nodes[i]!.node?.data

                        if (!data || data.deleted) {
                            return null
                        }

                        return <EL_CardView
                            key={data.id}

                            paginator_data={props.paginator_data}
                            paginator_kind={props.paginator_kind}
                            paginator_status={props.paginator_status}
                            paginator_noderef={props.paginator_nodes[i]!}
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

export type EFCon__List_Props = {
    readonly paginator: EFCon_Paginator
}

export const EFCon_List: r.FC<EFCon__List_Props> = props => {
    const ref_container = r.useRef<HTMLDivElement | null>(null)

    const paginator_status = sr.useSignalOutput(props.paginator.status)

    const paginator_data = asr.useAtomConnect(r.useMemo(() => {
        return ({ reg }) => {
            return sc.osignal_new_memo(sc.osignal_new_pipe(
                sc.osignal_new_pipeflat(
                    sc.osignal_new_listpipe(props.paginator.data, ndata => {
                        switch (ndata.kind) {
                            case EFCon_NodeKind.Item:
                                return sc.osignal_new_memo(sc.osignal_new_pipe(
                                    reg(gs.rem.item.joins.core())({ id: ndata.node.statics.id }),
                                    node => ({
                                        node,
                                        kind: ndata.kind
                                    })
                                ))
                            case EFCon_NodeKind.Material:
                                return sc.osignal_new_memo(sc.osignal_new_pipe(
                                    reg(gs.rem.material.joins.core())({ id: ndata.node.statics.id }),
                                    node => ({
                                        node,
                                        kind: ndata.kind
                                    })
                                ))
                            case EFCon_NodeKind.ItemTemplate:
                                return sc.osignal_new_memo(sc.osignal_new_pipe(
                                    reg(gs.rem.tmplit.joins.core())({ id: ndata.node.statics.id }),
                                    node => ({
                                        node,
                                        kind: ndata.kind
                                    })
                                ))
                            case EFCon_NodeKind.MaterialTemplate:
                                return sc.osignal_new_memo(sc.osignal_new_pipe(
                                    reg(gs.rem.tmplmt.joins.core())({ id: ndata.node.statics.id }),
                                    node => ({
                                        node,
                                        kind: ndata.kind
                                    })
                                ))
                            case EFCon_NodeKind.ProductTemplate:
                                return sc.osignal_new_memo(sc.osignal_new_pipe(
                                    reg(gs.rem.tmplpr.joins.core())({ id: ndata.node.statics.id }),
                                    node => ({
                                        node,
                                        kind: ndata.kind
                                    })
                                ))
                        }
                    }),
                    nodes => {
                        return sc.osignal_new_merge(nodes)
                    }
                ),
                m => m || []
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
                paginator_kind={props.paginator.search.kind}
            />}
        </rfl.CmpRequire>
    </div>
}

export default EFCon_List
