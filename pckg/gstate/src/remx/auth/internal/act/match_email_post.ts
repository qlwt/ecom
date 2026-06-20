import * as capi from "@fst/capi"
import * as asc from "@qyu/atom-state-core"
import { rem } from "@src/rem"
import { remx_auth__state } from "@src/remx/auth/internal/state"

export type RemXAuth__ActMatchEmailPost_Params = {
    readonly rparams: capi.SendRestX_AuthMatchEmailPost_Params
}

export const remx_auth__act_match_email_post = function(params: RemXAuth__ActMatchEmailPost_Params): asc.AtomAction {
    return ({ reg }) => {
        const acc_state = reg(remx_auth__state)

        const action = function() {
            if (params.rparams.config?.signal_abort?.aborted) {
                return
            }

            const promise = capi.send_restx_auth_match_email_post({
                body: params.rparams.body,

                config: {
                    ...params.rparams.config,

                    events: {
                        ...params.rparams.config?.events,

                        success: data => {
                            reg(rem.acc_authemail.register).reg({ id: data.id, }).real.input(
                                asc.reqstate_new_fulfilled(data)
                            )

                            params.rparams.config?.events?.success?.(data)
                        },
                    },

                    hooks: {
                        ...params.rparams.config?.hooks,

                        noauth: () => {
                            acc_state.real.input(asc.reqstate_new_empty())

                            params.rparams.config?.hooks?.noauth?.()
                        },
                    },
                },
            })

            promise.then(res => {
                if (res.success) {
                    reg(rem.acc_authemail.register).reg({
                        id: res.body.id
                    }).real.input(asc.reqstate_new_fulfilled(res.body))

                    const old_acc_realdata = asc.reqstate_data(acc_state.real.output())

                    if (old_acc_realdata) {
                        acc_state.real.input(asc.reqstate_new_fulfilled({
                            ...old_acc_realdata,

                            status_sessional: 0,
                        }))
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
