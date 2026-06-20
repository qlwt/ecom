import * as capi from "@fst/capi"
import * as asc from "@qyu/atom-state-core"
import { remx_auth__state } from "@src/remx/auth/internal/state"

export type RemXAuth__ActSignInEmail_Params = {
    readonly rparams: capi.SendRestX_AuthSignInEmail_Params
}

export const remx_auth__act_signin_email = function (params: RemXAuth__ActSignInEmail_Params): asc.AtomAction {
    return ({ reg }) => {
        capi.send_restx_auth_signin_email({
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
