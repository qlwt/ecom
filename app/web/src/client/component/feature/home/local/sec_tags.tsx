import * as capi from "@fst/capi"
import * as gs from "@fst/gstate"
import { rem } from "@fst/gstate"
import * as asr from "@qyu/atom-state-react"
import * as rfl from "@qyu/reactcmp-flow-control"
import * as sc from "@qyu/signal-core"
import ELHome_CardTag from "@src/client/component/feature/home/local/card_tag"
import st from "@src/client/component/feature/home/style/sec_tags.module.scss"
import { useAuthAcc } from "@src/client/hook/auth/acc"
import type { FnSetterStateful } from "@src/client/type/fns"
import * as r from "react"

type QuerySearch = {
    readonly tmplit: string | null
    readonly acc_id: string | null
}

let query_last: gs.Query<number, QuerySearch, readonly string[]> | null = null

const useTags = function(tmplit: string | null) {
    const acc = useAuthAcc()
    const dispatch = asr.useAtomDispatch()

    const query = r.useMemo(() => {
        if (query_last && query_last.search.tmplit === tmplit) {
            return query_last
        }

        return query_last = gs.query_new<number, QuerySearch, readonly string[]>({
            init: [],

            config: {
                search: {
                    tmplit,
                    acc_id: acc?.id ?? null,
                },

                retrydelay: 5000,
            },

            request_new: async api => {
                if (typeof api.search.tmplit === "string" && typeof api.search.acc_id === "string") {
                    capi.send_rest_data_get("item_tag", {
                        query: {
                            limit: api.param,

                            cursor: null,
                            include_hidden: 0,
                            filter_tmplit__id: [api.search.tmplit],
                            pick_owner: ["null-public", api.search.acc_id],
                        },

                        config: {
                            events: {
                                success: data => {
                                    sc.batcher.schedule(() => {
                                        dispatch(gs.nrem_dbslice_use(rem, data.slice))

                                        api.data.input(
                                            (data.slice.item_tag?.nodes ?? []).map(tag => tag.id)
                                        )
                                    })
                                },
                            },
                        },
                    })
                }

                return undefined
            },
        })
    }, [tmplit, acc])

    r.useEffect((): VoidFunction | void => {
        if (query && typeof tmplit === "string") {
            query.load(1000)

            return () => {
                query.cleanup()
            }
        }
    }, [query, tmplit])

    return asr.useAtomOutput(r.useMemo(() => {
        return ({ reg }) => {
            return sc.osignal_new_memo(sc.osignal_new_pipe(
                sc.osignal_new_pipeflat(
                    sc.osignal_new_listpipe(query?.data ?? null, id => {
                        return sc.osignal_new_memo(
                            sc.osignal_new_pipe(
                                reg(gs.rem.item_tag.joins.core())({ id }),
                                join => {
                                    if (!join?.data || join.data.deleted === 1) {
                                        return null
                                    }

                                    return join.data
                                }
                            )
                        )
                    }),
                    nodes => {
                        return sc.osignal_new_merge(nodes)
                    }
                ),
                m => m.filter(n => n !== null)
            ))
        }
    }, [query.data]))
}

export type ELHome_SecTags__Props = {
    readonly tmplit: string | null
    readonly selection: string | null
    readonly selection_set: FnSetterStateful<string | null>
}

export const ELHome_SecTags: r.FC<ELHome_SecTags__Props> = props => {
    const tag_list = useTags(props.tmplit)

    return <section className={st.root}>
        <rfl.CmpLoop data={tag_list}>
            {tag => {
                return <ELHome_CardTag
                    key={tag.id}

                    node={tag}
                    state_selected_set={props.selection_set}
                    state_selected={props.selection === tag.id}
                />
            }}
        </rfl.CmpLoop>

        <div className={st.placeholder} />
    </section>
}

export default ELHome_SecTags
