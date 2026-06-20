import st from "@client/component/feature/commision/style/page.module.scss"
import * as capi from "@fst/capi"
import * as dbdef from "@fst/db-default"
import * as gs from "@fst/gstate"
import { rem } from "@fst/gstate"
import * as asr from "@qyu/atom-state-react"
import * as rfl from "@qyu/reactcmp-flow-control"
import * as sc from "@qyu/signal-core"
import { useEFCommisionPrice } from "@src/client/component/feature/commision/hook/price"
import ELCommision_CardCartItem from "@src/client/component/feature/commision/local/card_cartitem"
import { efcommision__node_unavailable } from "@src/client/component/feature/commision/util/node_unavailable"
import EPCardImg_Headln_Btn from "@src/client/component/primitive/card-img/element/headln__btn"
import { useAuthAcc } from "@src/client/hook/auth/acc"
import { urlmap } from "@src/client/urlmap"
import { array_new_mapfilter } from "@src/client/util/array/new/mapfilter"
import { remclone_commision_node } from "@src/client/util/remclone/commision_node"
import cl from "classnames"
import * as r from "react"
import * as ri18 from "react-i18next"
import * as rr from "react-router"
import { v7 as uuid } from "uuid"

const randid = function(l: number): string {
    let result = ""

    for (let i = 0; i < l; ++i) {
        result += Math.floor(Math.random() * 10).toString()
    }

    return result
}

type UseLoadCart_Params = {
    readonly acc_id: string | null
}

const useLoadCart = function(params: UseLoadCart_Params) {
    const dispatch = asr.useAtomDispatch()

    const query = r.useMemo(() => {
        const acc_id = params.acc_id

        if (typeof acc_id === "string") {
            return gs.query_new<number, null, null>({
                init: null,

                config: {
                    search: null,
                    retrydelay: 5000,
                },

                request_new: async api => {
                    capi.send_rest_data_get("cart_refnode", {
                        query: {
                            cursor: null,
                            limit: api.param,

                            pick_owner: [acc_id],
                            include_hidden: null,
                        },

                        config: {
                            events: {
                                success: data => {
                                    sc.batcher.schedule(() => {
                                        dispatch(gs.nrem_dbslice_use(rem, data.slice))
                                    })
                                },
                            },
                        },
                    })

                    return undefined
                },
            })
        }

        return null
    }, [params.acc_id])

    r.useEffect((): VoidFunction | void => {
        if (query) {
            query.load(1000)

            return () => {
                query.cleanup()
            }
        }
    }, [query])
}

export type EFCommision__PageFinish_Props = {

}

export const EFCommision_PageFinish: r.FC<EFCommision__PageFinish_Props> = props => {
    const { t } = ri18.useTranslation()
    const { reg } = asr.useAtomStore()
    const navigate = rr.useNavigate()

    const acc = useAuthAcc()
    const cache_price = r.useMemo(() => new WeakMap<{}, number>(), [])
    const cache_unavailable = r.useMemo(() => new WeakMap<{}, boolean>(), [])

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

    const [statemap_disabled, statemap_disabled_set] = r.useState(() => new Set<string>())

    const { refnodes_valid, nodes_someunavailable } = r.useMemo(() => {
        let nodes_someunavailable = false

        const refnodes_valid = cart.filter(refnode => {
            const node_unavailable = efcommision__node_unavailable({
                node: refnode.node,
                cache_unavailable,
                mode_strict: false,
            })

            const node_disabled = statemap_disabled.has(refnode.id)

            if (node_unavailable) {
                nodes_someunavailable = true
            }

            return (
                !node_disabled
                && !node_unavailable
            )
        }) ?? []

        return { refnodes_valid, nodes_someunavailable }
    }, [cart, cache_unavailable, statemap_disabled])

    const price = useEFCommisionPrice({
        cache_price,
        ref_list: refnodes_valid,
        ref_pick_node: ref => ref.node,
        ref_pick_quantity: ref => Math.max(0, ref.quantity),
    })

    const state_disabled_toggle = r.useCallback((id: string) => {
        statemap_disabled_set(statemap_disabled => {
            const clone = new Set(statemap_disabled)

            if (clone.has(id)) {
                clone.delete(id)
            } else {
                clone.add(id)
            }

            return clone
        })
    }, [statemap_disabled_set])

    useLoadCart({ acc_id: acc?.id ?? null, })

    return <main className={st.root}>
        <div className={st.head}>
            <span className={st.head__price}>
                {price.toString()} {t("currency.uah")}
            </span>

            <EPCardImg_Headln_Btn
                state_disabled={refnodes_valid.length === 0}

                event_click={() => {
                    if (acc) {
                        const commision_id = uuid()

                        reg(rem.commision.act.post({
                            config: {
                                events: {
                                    success: () => {
                                        statemap_disabled_set(new Set())

                                        navigate(urlmap.shared.commision_view({ id: commision_id }))

                                        reg(rem.cart_refnode.act.delete({
                                            body: {
                                                ids: refnodes_valid.map(cnode => cnode.id),
                                            },
                                        }))
                                    },
                                },
                            },

                            body: [{
                                core: {
                                    ...dbdef.table.commision,

                                    id: commision_id,
                                    owner: acc.id,
                                    status_static: 0,
                                    id_public: randid(16),
                                    contact_email: acc.contact_email,
                                    contact_phone: acc.contact_phone,
                                    contact_fname: acc.contact_fname,
                                    contact_lname: acc.contact_lname,
                                    contact_pname: acc.contact_pname,
                                    delivery_division__id: acc.delivery_division__id,
                                },

                                joins: {
                                    refnodes: refnodes_valid.map(cnode => {
                                        const commision_node_id = uuid()

                                        return {
                                            core: {
                                                id: uuid(),
                                                commision__id: commision_id,
                                                commision_node__id: commision_node_id,
                                                owner: acc.id,
                                                quantity: cnode.quantity,
                                            },

                                            joins: {
                                                node: remclone_commision_node({
                                                    src: cnode.node,

                                                    overrides: {
                                                        owner: acc.id,
                                                        commision_node_id,
                                                    },
                                                }),
                                            },
                                        }
                                    })
                                }
                            }],
                        }))
                    }
                }}
            >
                {t("commision.create_commision")}
            </EPCardImg_Headln_Btn>
        </div>

        <div className={st.alerts}>
            <rfl.CmpIf value={nodes_someunavailable}>
                {() => <div className={cl(st.alert, st._error)}>
                    {t("commision.alert_nomaterials_cart_1")}

                    <br />
                    <br />

                    {t("commision.alert_nomaterials_cart_2")}
                </div>}
            </rfl.CmpIf>
        </div>

        <div className={st.grid}>
            <rfl.CmpLoop data={cart}>
                {cnode => {
                    const cnode_unavailable = efcommision__node_unavailable({
                        node: cnode.node,
                        mode_strict: true,
                        cache_unavailable,
                    })

                    return <ELCommision_CardCartItem
                        key={cnode.id}

                        status_static={false}
                        status_hideerror={false}

                        cache_price={cache_price}

                        node={cnode.node}
                        refnode_id={cnode.id}
                        refnode_name={"cart_refnode"}
                        refnode_quantity={cnode.quantity}

                        state_disabled_forced={cnode_unavailable}
                        state_disabled_toggle={state_disabled_toggle}
                        state_disabled={statemap_disabled.has(cnode.id) || cnode_unavailable}
                    />
                }}
            </rfl.CmpLoop>
        </div>
    </main >
}

export default EFCommision_PageFinish
