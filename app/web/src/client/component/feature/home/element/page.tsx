import * as capi from "@fst/capi"
import * as gs from "@fst/gstate"
import { rem } from "@fst/gstate"
import * as asr from "@qyu/atom-state-react"
import * as sc from "@qyu/signal-core"
import ELHome_SecItems from "@src/client/component/feature/home/local/sec_items"
import ELHome_SecTags from "@src/client/component/feature/home/local/sec_tags"
import ELHome_SecTmplIt from "@src/client/component/feature/home/local/sec_tmplit"
import st from "@src/client/component/feature/home/style/core.module.scss"
import { useAuthAcc } from "@src/client/hook/auth/acc"
import * as r from "react"

let query_last: gs.Query<number, Query_Search, readonly string[]> | null = null

type Query_Search = {
    readonly acc_id: string | null
}

const useTmplIt = function(acc_id: string | null) {
    const dispatch = asr.useAtomDispatch()

    const query = r.useMemo(() => {
        if (query_last && query_last.search.acc_id === acc_id) {
            return query_last
        }

        return query_last = gs.query_new<number, Query_Search, readonly string[]>({
            init: [],

            config: {
                retrydelay: 5000,
                search: { acc_id },
            },

            request_new: async api => {
                capi.send_rest_data_get("tmplit", {
                    query: {
                        limit: api.param,
                        pick_owner: typeof api.search.acc_id === "string" ? ["null-public", api.search.acc_id] : ["null-public"],

                        cursor: null,
                        search: null,
                        include_hidden: 0,
                    },

                    config: {
                        events: {
                            success: data => {
                                sc.batcher.schedule(() => {
                                    dispatch(gs.nrem_dbslice_use(rem, data.slice))

                                    api.data.input((data.slice.tmplit?.nodes ?? []).map(tmplit => tmplit.id))
                                })
                            },
                        },
                    },
                })

                return undefined
            },
        })
    }, [acc_id])

    r.useEffect(() => {
        query.load(1000)

        return () => {
            query.cleanup()
        }
    }, [query])

    return asr.useAtomOutput(r.useMemo(() => {
        return ({ reg }) => {
            return sc.osignal_new_memo(sc.osignal_new_pipe(
                sc.osignal_new_pipeflat(
                    sc.osignal_new_listpipe(query.data, id => {
                        return sc.osignal_new_memo(
                            sc.osignal_new_pipe(
                                reg(gs.rem.tmplit.joins.core())({ id }),
                                join => join?.data ?? null
                            )
                        )
                    }),
                    nodes => {
                        return sc.osignal_new_merge(nodes)
                    }
                ),
                m => m.filter((n): n is gs.Rem_JoinData<"tmplit"> => n !== null && !n.deleted)
            ))
        }
    }, [query.data]))
}

export type EFHome_Page_Props = {

}

export const EFHome_Page: r.FC<EFHome_Page_Props> = props => {
    const acc = useAuthAcc()

    const [tag_sel, tag_sel_set] = r.useState<string | null>(null)
    const [tmplit_sel, tmplit_sel_set] = r.useState<string | null>(null)

    const tmplit = useTmplIt(acc?.id ?? null)

    const tmplit_active = r.useMemo(() => {
        for (const tmplit_node of tmplit) {
            if (tmplit_node.id === tmplit_sel) {
                return tmplit_node
            } else if (tmplit_sel === null) {
                return tmplit_node
            }
        }

        return null
    }, [tmplit_sel, tmplit])

    return <main className={st.page}>
        <ELHome_SecTmplIt
            tmplit_list={tmplit ?? []}
            selection_set={tmplit_sel_set}
            selection={tmplit_active?.id ?? null}
        />

        <ELHome_SecTags
            tmplit={tmplit_active?.id ?? null}

            selection={tag_sel}
            selection_set={tag_sel_set}
        />

        <ELHome_SecItems
            tag={tag_sel}
            tmplit={tmplit_active?.id ?? null}
        />
    </main>
}

export default EFHome_Page
