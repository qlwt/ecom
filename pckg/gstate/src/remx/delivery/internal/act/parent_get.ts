import * as capi from "@fst/capi"
import * as asc from "@qyu/atom-state-core"
import * as sc from "@qyu/signal-core"
import { remx_auth__state } from "@src/remx/auth/internal/state"
import { remx_delivery__register_parent } from "@src/remx/delivery/internal/register_parent"

export type RemXDelivery_ActParentGet_Params = {
    readonly rparams: capi.SendRestX_DeliveryParentGet_Params
}

export const remx_delivery__act_parent_get = function(params: RemXDelivery_ActParentGet_Params): asc.AtomAction {
    return ({ reg }) => {
        const acc_state = reg(remx_auth__state)

        const action = function() {
            if (params.rparams.config?.signal_abort?.aborted) {
                return
            }

            const controller_abort = new AbortController()

            const promise = capi.send_restx_delivery_parent_get({
                ...params.rparams,

                config: {
                    ...params.rparams.config,

                    signal_abort: AbortSignal.any([
                        controller_abort.signal,
                        params.rparams.config?.signal_abort,
                    ].filter(s => s !== undefined)),

                    hooks: {
                        ...params.rparams.config?.hooks,

                        noauth: () => {
                            acc_state.real.input(asc.reqstate_new_empty())

                            params.rparams.config?.hooks?.noauth?.()
                        },
                    },
                }
            })

            promise.then(getres_api => {
                if (getres_api.success) {
                    const getres = getres_api.body
                    const register = reg(remx_delivery__register_parent)

                    sc.batcher.batch_sync(() => {
                        for (const node of getres.nodes) {
                            register.reg({ numid: node.numid, }).real.input(asc.reqstate_new_fulfilled(node))
                        }
                    })
                }
            })
        }

        const sub = () => {
            if (acc_state.real.output().status === asc.ReqState__Status.Fulfilled) {
                action()

                acc_state.real.rmsub(sub)
            }
        }

        {
            if (acc_state.real.output().status === asc.ReqState__Status.Fulfilled) {
                action()
            } else {
                acc_state.real.addsub(sub)
            }
        }
    }
}
