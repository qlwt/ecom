import st_base from "@client/component/feature/acc-profile/style/view.module.scss"
import st from "@client/component/feature/acc-profile/style/view_commisions.module.scss"
import * as capi from "@fst/capi"
import * as gs from "@fst/gstate"
import { rem } from "@fst/gstate"
import * as asr from "@qyu/atom-state-react"
import * as rfl from "@qyu/reactcmp-flow-control"
import * as sc from "@qyu/signal-core"
import EPCardCommision_ViewRead from "@src/client/component/primitive/card-commision/element/view_read"
import { useAuthAcc } from "@src/client/hook/auth/acc"
import { array_new_mapfilter } from "@src/client/util/array/new/mapfilter"
import * as r from "react"

const useLoad = (acc_id: string | null) => {
    const store = asr.useAtomStore()

    const query = r.useMemo(() => {
        if (acc_id) {
            return gs.query_new({
                init: null,

                config: {
                    search: "",
                    retrydelay: 5000,
                },

                request_new: () => {
                    return capi.send_rest_data_get("commision", {
                        query: {
                            limit: 10000,
                            cursor: null,

                            include_hidden: null,
                            pick_owner: [acc_id],

                            search: null,
                            id_public: null,
                        },
                    }).then(result => {
                        if (result.success) {
                            sc.batcher.batch_sync(() => {
                                store.dispatch(gs.nrem_dbslice_use(rem, result.body.slice))
                            })
                        } else {
                            throw result.reason
                        }
                    })
                },
            })
        }

        return null
    }, [acc_id, store])

    r.useEffect((): VoidFunction | void => {
        if (query) {
            query.load(null)

            return () => {
                query.cleanup()
            }
        }
    }, [query])
}

export type EFAccProfile__ViewCommision_Props = {
}

export const EFAccProfile_ViewCommision: r.FC<EFAccProfile__ViewCommision_Props> = props => {
    const acc = useAuthAcc()

    const commisions = asr.useAtomOutput(r.useMemo(() => {
        return ({ reg }) => {
            return sc.osignal_new_memo(sc.osignal_new_pipeflat(
                sc.osignal_new_listpipe(
                    reg(rem.commision.indexer_new(["deleted", "owner"] as const)).reg({
                        deleted: 0,
                        owner: acc?.id ?? "never"
                    }),
                    node => {
                        return reg(rem.commision.joins.core())({
                            id: node.statics.id,
                        })
                    }
                ),
                nodes_s => sc.osignal_new_pipe(
                    sc.osignal_new_merge(nodes_s),
                    nodes => {
                        return array_new_mapfilter(nodes, node => {
                            if (node && node.data && node.data.deleted === 0) {
                                return node.data
                            }

                            return null
                        })
                    }
                )
            ))
        }
    }, [acc?.id]))

    useLoad(acc?.id ?? null)

    return <section className={st_base.root}>
        <div className={st.view}>
            <rfl.CmpLoop data={commisions}>
                {node => {
                    return <div key={node.id} className={st.card}>
                        <EPCardCommision_ViewRead node={node} />
                    </div>
                }}
            </rfl.CmpLoop>
        </div>
    </section>
}

export default EFAccProfile_ViewCommision
