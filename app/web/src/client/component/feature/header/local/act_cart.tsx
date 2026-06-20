import * as gs from "@fst/gstate"
import { rem, remx } from "@fst/gstate"
import * as asc from "@qyu/atom-state-core"
import * as asr from "@qyu/atom-state-react"
import * as ddn from "@qyu/reactcmp-dropdown"
import * as rfl from "@qyu/reactcmp-flow-control"
import * as sc from "@qyu/signal-core"
import * as sr from "@qyu/signal-react"
import ELHeader_CardCart from "@src/client/component/feature/header/local/card_cart"
import st from "@src/client/component/feature/header/style/act.module.scss"
import EPCardImg_Headln from "@src/client/component/primitive/card-img/element/headln"
import EPCardImg_Headln_Link from "@src/client/component/primitive/card-img/element/headln__link"
import EPIcon_FA from "@src/client/component/primitive/icon/element/view"
import { domroot_dropdown } from "@src/client/const/domroot"
import { urlmap } from "@src/client/urlmap"
import { array_new_mapfilter } from "@src/client/util/array/new/mapfilter"
import cl from "classnames"
import * as r from "react"
import * as ri18 from "react-i18next"

const batchsize = 10

type Paginator_Search = {
    readonly acc_id: string | null
}

type Paginator_Node = gs.Rem_Node<"cart_refnode">

type Paginator_Cursor = string | null

type Paginator_Limit = number

type Paginator = gs.PaginatorList<Paginator_Node, Paginator_Search, Paginator_Limit>

type Paginator_New_Params = {
    readonly store: asc.AtomStore
    readonly acc_id: string | null
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
                acc_id: params.acc_id,
            },
        },

        request_new: api => {
            const acc_id = api.search.acc_id

            if (acc_id === null) {
                return Promise.resolve({
                    cursor: null,
                })
            }

            return new Promise((res, rej) => {
                params.store.reg(rem.cart_refnode.act.get({
                    query: {
                        limit: api.limit,
                        cursor: api.cursor ?? null,

                        include_hidden: 0,
                        pick_owner: [acc_id],
                    },

                    config: {
                        signal_abort: api.signal_abort,

                        events: {
                            failure: reason => {
                                rej(reason)
                            },

                            success: data => {
                                api.data.input([
                                    ...api.data.output(),

                                    ...(data.slice.cart_refnode?.nodes ?? []).flatMap(n => {
                                        return params.store.reg(gs.rem.cart_refnode.register).reg({ id: n.id })
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

export type ELHeader__ActCart_Props = {

}

export const ELHeader_ActCart: r.FC<ELHeader__ActCart_Props> = props => {
    const { t } = ri18.useTranslation()

    const store = asr.useAtomStore()
    const ref_list = r.useRef<HTMLDivElement | null>(null)
    const ref_container = r.useRef<HTMLDivElement | null>(null)

    const [open, open_set] = r.useState(false)

    const acc = sr.useSignalOutput(asr.useAtomValue(r.useCallback(
        ({ reg }) => sc.osignal_new_memo(
            sc.osignal_new_pipe(reg(remx.auth.joins.core())({}), n => n?.data ?? null),
            null
        ),
        [])
    ))

    const cart = asr.useAtomOutput(r.useCallback(({ reg }) => {
        return sc.osignal_new_memo(
            sc.osignal_new_pipeflat(
                sc.osignal_new_listpipe(
                    reg(rem.cart_refnode.indexer_new(["owner", "deleted"])).reg({
                        deleted: 0,
                        owner: acc?.id ?? "never",
                    }),
                    node => {
                        return sc.osignal_new_memo(
                            reg(rem.cart_refnode.joins.core())({
                                id: node.statics.id,
                            }),
                            null
                        )
                    }
                ),
                nodes_s => sc.osignal_new_pipe(
                    sc.osignal_new_merge(nodes_s),
                    nodes => array_new_mapfilter(nodes, node => node?.data ?? null)
                )
            ),
            null,
        )
    }, [acc?.id]))

    const paginator = r.useMemo(() => {
        if (paginator_last && paginator_last.search.acc_id === (acc?.id ?? null)) {
            return paginator_last
        }

        return paginator_last = paginator_new({
            store,
            acc_id: acc?.id ?? null
        })
    }, [store, acc?.id])

    const paginator_status = sr.useSignalConnect(paginator.status)

    r.useEffect((): VoidFunction | void => {
        if (paginator_status.value === gs.PaginatorList_Status.Idle && paginator.search.acc_id !== null) {
            const list = ref_list.current
            const container = ref_container.current

            if (paginator.data.output().length === 0) {
                paginator.load(batchsize)
            } else if (list && container) {
                const controller_abort = new AbortController()

                const paginator_update = () => {
                    const list_box = list.getBoundingClientRect()
                    const container_box = container.getBoundingClientRect()

                    if ((list_box.height + list_box.y) - (container_box.y + container_box.height) < 200) {
                        paginator.load(batchsize)
                    }
                }

                window.addEventListener("resize", paginator_update, { signal: controller_abort.signal, })
                window.addEventListener("scroll", paginator_update, { signal: controller_abort.signal, })
                container.addEventListener("scroll", paginator_update, { signal: controller_abort.signal, })

                paginator_update()

                return () => {
                    controller_abort.abort()
                }
            }
        }
    }, [paginator, paginator_status, paginator.search.acc_id, open])

    asr.useAtomLoader({
        atomloader: remx.auth.loaders.check,
        params: []
    })

    return <ddn.CmpContainerVirtual open={open} open_set={open_set}>
        <ddn.CmpButton isroot className={cl(st.root, st._cart)}>
            <EPIcon_FA def={`cart`} />

            <rfl.CmpRequire value={[cart.length] as const} state_empty={([l]) => l === 0}>
                {([length]) => {
                    return <div className={st.counter}>
                        <span>
                            {length <= 9 ? length : `9+`}
                        </span>
                    </div>
                }}
            </rfl.CmpRequire>
        </ddn.CmpButton>

        <ddn.CmpListPortal portal={domroot_dropdown} align={`center`} gap={2} className={cl(st.ddnlist, st._cart)}>
            {() => <ddn.CmpContent className={cl(st.ddncontent)}>
                <div ref={ref_container} className={st.list__wrapper}>
                    <div ref={ref_list} className={st.list}>
                        <rfl.CmpLoop data={cart}>
                            {node => {
                                return <ELHeader_CardCart key={node.id} refnode={node} />
                            }}
                        </rfl.CmpLoop>
                    </div>
                </div>

                <rfl.CmpIf value={cart.length > 0}>
                    <EPCardImg_Headln className={st.act_cart__result}>
                        <EPCardImg_Headln_Link
                            href={urlmap.shared.commision_finish()}

                            event_click={() => {
                                open_set(false)
                            }}
                        >
                            {t("nav.cart_finishorder")}
                        </EPCardImg_Headln_Link>
                    </EPCardImg_Headln>
                </rfl.CmpIf>
            </ddn.CmpContent>}
        </ddn.CmpListPortal>
    </ddn.CmpContainerVirtual>
}

export default ELHeader_ActCart
