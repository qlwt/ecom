import * as capi from "@fst/capi"
import * as asc from "@qyu/atom-state-core"
import { remx_auth__state } from "@src/remx/auth/internal/state"

export type RemXAuth__ActSignUpEmail_Params = {
    readonly rparams: capi.SendRestX_AuthSignUpEmail_Params
}

export const remx_auth__act_signup_email = function (params: RemXAuth__ActSignUpEmail_Params): asc.AtomAction {
    return ({ reg }) => {
        capi.send_restx_auth_signup_email({
            body: params.rparams.body,

            config: {
                ...params.rparams.config,

                events: {
                    ...params.rparams.config?.events,

                    success: data => {
                        reg(remx_auth__state).real.input(asc.reqstate_new_fulfilled(data.acc))

                        params.rparams.config?.events?.success?.(data)
                    },
                },
            },
        })
    }
}
