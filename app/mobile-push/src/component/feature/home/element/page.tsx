import { EFHeader_View } from "@/src/component/feature/header/element/view"
import ELHome_Notification from "@/src/component/feature/home/local/notification"
import { efhome__stf_core } from "@/src/component/feature/home/style/core"
import { usePalette } from "@/src/component/primitive/ctx-palette/hook/palette"
import EPVList_View from "@/src/component/primitive/vlist/element/view"
import * as capi from "@fst/capi"
import * as gs from "@fst/gstate"
import { rem, remx } from "@fst/gstate"
import * as asc from "@qyu/atom-state-core"
import * as asr from "@qyu/atom-state-react"
import * as sc from "@qyu/signal-core"
import * as sr from "@qyu/signal-react"
import * as rnav from "@react-navigation/native"
import * as r from "react"
import * as rn from "react-native"

const paginator_new = function(store: asc.AtomStore) {
    return gs.paginator_new_list<gs.Rem_Node<"ping_msg">, string, string | null, number>({
        init: {
            data: [],
            cursor: null,
        },

        config: {
            search: "",
            retrydelay: 5000,
        },

        request_new: api => {
            return new Promise<{ cursor: string | null }>(async (res, rej) => {
                sc.osignal_when_pick(
                    sc.osignal_new_pipe(
                        store.reg(remx.auth.state).real,
                        real_o => {
                            if (real_o.status === asc.ReqState__Status.Fulfilled) {
                                return {
                                    pick: true,
                                    value: null
                                }
                            }

                            return {
                                pick: false,
                                value: null
                            }
                        }
                    ),
                    async () => {
                        const result = await capi.send_rest_data_get("ping_msg", {
                            query: {
                                limit: api.limit,
                                pick_owner: null,
                                include_hidden: 1,
                                cursor: api.cursor ?? null,
                            },
                        })

                        if (result.success) {
                            sc.batcher.batch_sync(() => {
                                store.dispatch(gs.nrem_dbslice_use(rem, result.body.slice))

                                api.data.input([
                                    ...api.data.output(),

                                    ...(result.body.slice.ping_msg?.nodes ?? []).map(n => {
                                        return store.reg(rem.ping_msg.register).reg({
                                            id: n.id,
                                        })
                                    })
                                ])
                            })

                            res({
                                cursor: result.body.cursor
                            })
                        } else {
                            rej("error")
                        }
                    }
                )
            })
        },
    })
}

type EFHome__Page_Params = rnav.StaticScreenProps<{}>

export const EFHome_Page: r.FC<EFHome__Page_Params> = () => {
    const store = asr.useAtomStore()
    const theme = usePalette()
    const st = efhome__stf_core({ theme })

    const [paginator, paginator_set] = r.useState(() => {
        return paginator_new(store)
    })

    const paginator_status = sr.useSignalOutput(paginator.status)

    const paginator_data = asr.useAtomOutput(r.useCallback(({ reg }) => {
        return sc.osignal_new_memo(
            sc.osignal_new_pipeflat(
                sc.osignal_new_listpipe(
                    paginator.data,
                    remnode => {
                        return sc.osignal_new_memo(
                            reg(rem.ping_msg.joins.core())({
                                id: remnode.statics.id,
                            }),
                            null
                        )
                    }
                ),
                joins_s => sc.osignal_new_pipe(
                    sc.osignal_new_merge(joins_s),
                    joins => {
                        return joins
                            .map(join => join?.data ?? null)
                            .filter((jdata): jdata is NonNullable<typeof jdata> => {
                                return jdata !== null && jdata.deleted === 0
                            })
                    }
                )
            ),
            null
        )
    }, [paginator.data]))

    return <rn.View style={st.root}>
        <EFHeader_View
            event_refresh={() => {
                paginator_set(paginator_new(store))
            }}
        />

        <EPVList_View
            list_hcap={1}
            list_vgap={15}
            list_vpad={15}
            list_vbuff={1}
            list_rowheight={52}
            items_length={paginator_data.length}

            items_render={i => {
                const node = paginator_data[i]!

                return <ELHome_Notification key={node.id} node={node} />
            }}

            list_render={props => {
                return <rn.View {...props} style={[props.style, st.list]} />
            }}

            scroll_render={props => {
                return <rn.ScrollView {...props} />
            }}

            pagination={{
                status: paginator_status,
                threashhold: 3,

                load: () => {
                    paginator.load(10)
                },
            }}
        />
    </rn.View>
}
