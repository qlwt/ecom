import * as capi from "@fst/capi"
import * as asc from "@qyu/atom-state-core"
import { remx_auth__state } from "@src/remx/auth/internal/state"

export type RemXAuth__ActDelete_Params = {
    readonly rparams: capi.SendRestX_AuthDelete_Params
}

export const remx_auth__act_delete = function(params: RemXAuth__ActDelete_Params): asc.AtomAction {
    return ({ reg }) => {
        const acc_state = reg(remx_auth__state)

        const action = function() {
            if (params.rparams.config?.signal_abort?.aborted) {
                return
            }

            const promise = capi.send_restx_auth_delete({
                ...params.rparams,

                config: {
                    ...params.rparams.config,

                    events: {
                        ...params.rparams.config?.events,

                        success: data => {
                            reg(remx_auth__state).real.input(asc.reqstate_new_empty())

                            params.rparams.config?.events?.success?.(data)
                        },
                    },
                },
            })

            promise.then(res => {
                if (res.success) {
                    const acc_realdata = asc.reqstate_data(acc_state.real.output())

                    if (acc_realdata && params.rparams.body.ids.includes(acc_realdata.id)) {
                        acc_state.real.input(asc.reqstate_new_empty())
                    }
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
