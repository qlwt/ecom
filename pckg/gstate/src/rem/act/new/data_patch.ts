import * as capi from "@fst/capi"
import * as cc from "@fst/config/client"
import * as asc from "@qyu/atom-state-core"
import { remx_auth__state } from "@src/remx/auth/internal/state"
import type { Rem_Config } from "@src/rem/type/config"
import type { Rem_DataActPatch_Config, Rem_DataActPatch_RParams, Rem_NodeDef, Rem_Result } from "@src/rem/type/result"
import { promise_new_remdeps } from "@src/util/promise/remdeps"

export type NRemAct_NewDataPatch_Params<TName extends keyof cc.RemDefData> = {
    readonly table_name: TName
    readonly config: Rem_DataActPatch_Config
    readonly rparams: Rem_DataActPatch_RParams<TName>

    readonly rem_config: Rem_Config
    readonly rem_new: () => Rem_Result
}

export const nrem_act_new_data_patch = function <TName extends keyof cc.RemDefData>(
    params: NRemAct_NewDataPatch_Params<TName>
): asc.AtomAction {
    return ({ reg }) => {
        const acc_state = reg(remx_auth__state)

        const action = function() {
            if (params.rparams.config?.signal_abort?.aborted) {
                return
            }

            reg(asc.atomremnode_action_patch<Rem_NodeDef<"item">>({
                name: "patch",

                node: () => {
                    return reg(params.rem_new()[params.table_name as "item"].register).reg({
                        id: params.rparams.body.id,
                    })
                },

                data: {
                    merge: true,
                    kind: "flat",
                    value: params.rparams.body.patch as Partial<cc.RemDef[TName]["data"]>,
                },

                config: {
                    delay: 500,
                },

                request: (api) => {
                    const controller_abort = new AbortController()

                    const promise = promise_new_remdeps({
                        deps: params.config.deps ?? [],

                        signal_abort: AbortSignal.any([
                            controller_abort.signal,
                            params.rparams.config?.signal_abort,
                        ].filter(s => s !== undefined)),

                        request_new: l_params => capi.send_rest_data_patch(params.table_name, {
                            ...params,

                            body: (api.patch
                                ? { id: params.rparams.body.id, patch: api.patch }
                                : params.rparams.body
                            ),

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
                        }),
                    })

                    return {
                        promise,

                        promise_abort: () => {
                            controller_abort.abort()
                        },

                        promise_interpret: (api) => {
                            if (api.result.success) {
                                return api.patch ?? params.rparams.body.patch
                            }

                            return null
                        },
                    }
                },
            }))
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
