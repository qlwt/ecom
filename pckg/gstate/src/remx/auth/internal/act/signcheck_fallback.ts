import * as capi from "@fst/capi"
import * as asc from "@qyu/atom-state-core"
import { remx_auth__state } from "@src/remx/auth/internal/state"

export type RemXAuth__ActSignCheckFallback_Params = {
    readonly rparams: capi.SendRestX_AuthSignCheckFallback_Params
}

export const remx_auth__act_signcheck_fallback = function(params: RemXAuth__ActSignCheckFallback_Params): asc.AtomAction {
    return ({ reg }) => {
        capi.send_restx_auth_signcheck_fallback({
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
