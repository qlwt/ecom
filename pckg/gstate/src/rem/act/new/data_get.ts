import * as capi from "@fst/capi"
import * as cc from "@fst/config/client"
import * as asc from "@qyu/atom-state-core"
import * as sc from "@qyu/signal-core"
import { remx_auth__state } from "@src/remx/auth/internal/state"
import type { Rem_Config } from "@src/rem/type/config"
import type { Rem_DataActGet_Config, Rem_DataActGet_RParams, Rem_Result } from "@src/rem/type/result"
import { nrem_dbslice_use } from "@src/rem/util/dbslice_use"
import { promise_new_remdeps } from "@src/util/promise/remdeps"

export type NRemAct_NewDataGet_Params<TName extends keyof cc.RemDefData> = {
    readonly table_name: TName
    readonly config: Rem_DataActGet_Config
    readonly rparams: Rem_DataActGet_RParams<TName>

    readonly rem_config: Rem_Config
    readonly rem_new: () => Rem_Result
}

export const nrem_act_new_data_get = function <TName extends keyof cc.RemDefData>(
    params: NRemAct_NewDataGet_Params<TName>
): asc.AtomAction {
    return ({ reg }) => {
        const acc_state = reg(remx_auth__state)

        const action = function() {
            if (params.rparams.config?.signal_abort?.aborted) {
                return
            }

            const controller_abort = new AbortController()

            const promise = promise_new_remdeps({
                deps: params.config.deps ?? [],

                signal_abort: AbortSignal.any([
                    controller_abort.signal,
                    params.rparams.config?.signal_abort,
                ].filter(s => s !== undefined)),

                request_new: l_params => capi.send_rest_data_get(
                    params.table_name,
                    {
                        ...params.rparams,

                        config: {
                            ...params.rparams.config,

                            signal_abort: l_params.signal_abort,

                            hooks: {
                                ...params.rparams.config?.hooks,

                                noauth: () => {
                                    acc_state.real.input(asc.reqstate_new_empty())

                                    params.rparams.config?.hooks?.noauth?.()
                                },
                            },
                        }
                    }
                ),
            })

            promise.then(getres_api => {
                if (getres_api.success) {
                    const getres = getres_api.body

                    sc.batcher.batch_sync(() => {
                        reg(nrem_dbslice_use(params.rem_new(), getres.slice))
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
