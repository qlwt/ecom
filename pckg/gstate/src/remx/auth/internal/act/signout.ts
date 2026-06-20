import * as capi from "@fst/capi"
import * as asc from "@qyu/atom-state-core"
import { remx_auth__state } from "@src/remx/auth/internal/state"

export type RemXAuth__ActSignOut_Params = {
    readonly rparams: capi.SendRestX_AuthSignOut_Params
}

export const remx_auth__act_signout = function (params: RemXAuth__ActSignOut_Params): asc.AtomAction {
    return ({ reg }) => {
        capi.send_restx_auth_signout({
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
    }
}
