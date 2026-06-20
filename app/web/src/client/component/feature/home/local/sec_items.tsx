import * as gs from "@fst/gstate"
import * as asc from "@qyu/atom-state-core"
import * as asr from "@qyu/atom-state-react"
import * as rfl from "@qyu/reactcmp-flow-control"
import * as sc from "@qyu/signal-core"
import * as sr from "@qyu/signal-react"
import { ELHome_CardItem } from "@src/client/component/feature/home/local/card_item"
import st from "@src/client/component/feature/home/style/sec_item.module.scss"
import EPPending_Spinner, { EPPending_Spinner_Size } from "@src/client/component/primitive/pending/element/spinner"
import { useAuthAcc } from "@src/client/hook/auth/acc"
import cl from "classnames"
import * as r from "react"

const batchsize = 20

type Paginator_Search = {
    readonly tmplit: string | null
    readonly tag: string | null
    readonly acc_id: string | null
}

type Paginator_Node = gs.Rem_Node<"item">

type Paginator_Cursor = string | null

type Paginator_Limit = number

type Paginator = gs.PaginatorList<Paginator_Node, Paginator_Search, Paginator_Limit>

type Paginator_New_Params = {
    readonly store: asc.AtomStore,
    readonly tmplit: string | null
    readonly tag: string | null
    readonly acc: gs.Rem_JoinData<"acc"> | null
}

const paginator_new = function(params: Paginator_New_Params) {
    return gs.paginator_new_list<Paginator_Node, Paginator_Search, Paginator_Cursor, Paginator_Limit>({
        init: {
            data: [],
            cursor: null,
        },

        config: {
            retrydelay: 5000,

            search: {
                tag: params.tag,
                tmplit: params.tmplit,
                acc_id: params.acc?.id ?? null,
            },
        },

        request_new: api => {
            return new Promise((res, rej) => {
                params.store.reg(gs.rem.item.act.get({
                    query: {
                        limit: api.limit,
                        cursor: api.cursor ?? null,

                        search: null,
                        filter_tag__id: api.search.tag === null ? null : [api.search.tag],
                        pick_tmplit__id: api.search.tmplit === null ? null : [api.search.tmplit],

                        include_hidden: 0,
                        pick_owner: params.acc ? ["null-public", params.acc.id] : ["null-public"],
                    } as const,

                    config: {
                        signal_abort: api.signal_abort,

                        events: {
                            failure: reason => {
                                rej(reason)
                            },

                            success: data => {
                                api.data.input([
                                    ...api.data.output(),

                                    ...(data.slice.item?.nodes ?? []).map(n => {
                                        return params.store.reg(gs.rem.item.register).reg({ id: n.id })
                                    })
                                ])

                                res({ cursor: data.cursor } as const)
                            },
                        }
                    }
                }))

            })
        },
    })
}

let paginator_last: Paginator | null = null

export type ELHome_SecItems__Props = {
    readonly tag: string | null
    readonly tmplit: string | null
}

export const ELHome_SecItems: r.FC<ELHome_SecItems__Props> = props => {
    const store = asr.useAtomStore()
    const ref_container = r.useRef<HTMLDivElement | null>(null)
    const acc = useAuthAcc()

    const paginator = r.useMemo(() => {
        if (
            paginator_last
            && paginator_last.search.tag === props.tag
            && paginator_last.search.acc_id === acc?.id
            && paginator_last.search.tmplit === props.tmplit
        ) {
            return paginator_last
        }

        return paginator_last = paginator_new({
            acc,
            store,
            tag: props.tag,
            tmplit: props.tmplit,
        })
    }, [store, props.tmplit, props.tag, acc])

    const paginator_status = sr.useSignalConnect(paginator.status)

    const paginator_data = sr.useSignalConnect(r.useMemo(() => {
        const a = sc.osignal_new_memo(sc.osignal_new_pipe(
            sc.osignal_new_pipeflat(
                sc.osignal_new_listpipe(paginator.data, ndata => {
                    return sc.osignal_new_memo(
                        store.reg(gs.rem.item.joins.core())({ id: ndata.statics.id })
                    )
                }),
                nodes => {
                    return sc.osignal_new_merge(nodes)
                }
            ),
            m => m || []
        ))

        return a
    }, [paginator.data]))

    r.useEffect((): VoidFunction | void => {
        if (paginator_status.value === gs.PaginatorList_Status.Idle && paginator.search.tmplit !== null) {
            const paginator_update = () => {
                const container = ref_container.current

                if (container) {
                    const container_box = container.getBoundingClientRect()

                    if (container_box.y + container_box.height - window.innerHeight < 800) {
                        paginator.load(batchsize)
                    }
                }
            }

            window.addEventListener("resize", paginator_update)
            window.addEventListener("scroll", paginator_update)

            paginator_update()

            return () => {
                window.addEventListener("resize", paginator_update)
                window.removeEventListener("scroll", paginator_update)
            }
        }
    }, [paginator, paginator_data, paginator_status])

    return <section ref={ref_container} className={st.root}>
        <div className={cl(st.grid)}>
            <rfl.CmpLoop data={paginator_data.value ?? []}>
                {node => {
                    const data = node?.data

                    if (data && !data.deleted) {
                        return <ELHome_CardItem
                            key={data.id}

                            node={node.data}
                        />
                    }

                    return null
                }}
            </rfl.CmpLoop>
        </div>

        <rfl.CmpIf value={paginator_status.value !== gs.PaginatorList_Status.Fulfilled}>
            <div className={st.pendingpanel}>
                <EPPending_Spinner size={EPPending_Spinner_Size.Big} />
            </div>
        </rfl.CmpIf>
    </section>
}

export default ELHome_SecItems
