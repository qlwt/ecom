import * as capi from "@fst/capi"
import * as asc from "@qyu/atom-state-core"
import { remx_auth__state } from "@src/remx/auth/internal/state"

export type RemXAuth__ActMatchEmailPatch_Params = {
    readonly rparams: capi.SendRestX_AuthMatchEmailPatch_Params
}

export const remx_auth__act_match_email_patch = function(params: RemXAuth__ActMatchEmailPatch_Params): asc.AtomAction {
    return ({ reg }) => {
        const acc_state = reg(remx_auth__state)

        const action = function() {
            if (params.rparams.config?.signal_abort?.aborted) {
                return
            }

            capi.send_restx_auth_match_email_patch({
                body: params.rparams.body,

                config: {
                    ...params.rparams.config,

                    events: {
                        ...params.rparams.config?.events,

                        success: data => {
                            params.rparams.config?.events?.success?.(data)
                        },
                    },

                    hooks: {
                        ...params.rparams.config?.hooks,

                        noauth: () => {
                            acc_state.real.input(asc.reqstate_new_empty())

                            params.rparams.config?.hooks?.noauth?.()
                        }
                    },
                },
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
