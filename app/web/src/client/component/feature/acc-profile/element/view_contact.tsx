import st_base from "@client/component/feature/acc-profile/style/view.module.scss"
import st from "@client/component/feature/acc-profile/style/view_contact.module.scss"
import * as capi from "@fst/capi"
import * as gs from "@fst/gstate"
import { rem } from "@fst/gstate"
import * as asr from "@qyu/atom-state-react"
import * as rfl from "@qyu/reactcmp-flow-control"
import * as sc from "@qyu/signal-core"
import EPCardContact_ViewRead from "@src/client/component/primitive/card-contact/element/view_read"
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
                    return capi.send_rest_data_get("contact_message", {
                        query: {
                            limit: 1000,
                            cursor: null,
                            pick_owner: [acc_id],

                            search: null,
                            include_hidden: null,
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

export type EFAccProfile__ViewContact_Props = {
}

export const EFAccProfile_ViewContact: r.FC<EFAccProfile__ViewContact_Props> = props => {
    const acc = useAuthAcc()

    const contacts = asr.useAtomOutput(r.useMemo(() => {
        return ({ reg }) => {
            return sc.osignal_new_memo(sc.osignal_new_pipeflat(
                sc.osignal_new_listpipe(
                    reg(rem.contact_message.indexer_new(["deleted", "owner"] as const)).reg({
                        deleted: 0,
                        owner: acc?.id ?? "never"
                    }),
                    node => {
                        return reg(rem.contact_message.joins.core())({
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
            <rfl.CmpLoop data={contacts}>
                {node => {
                    return <div key={node.id} className={st.card}>
                        <EPCardContact_ViewRead node={node} />
                    </div>
                }}
            </rfl.CmpLoop>
        </div>
    </section>
}

export default EFAccProfile_ViewContact
