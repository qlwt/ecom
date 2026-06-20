import * as capi from "@fst/capi"
import * as asc from "@qyu/atom-state-core"
import { remx_auth__state } from "@src/remx/auth/internal/state"

export type RemXAuth__ActSignCheckStrict_Params = {
    readonly rparams: capi.SendRestX_AuthSignCheckStrict_Params
}

export const remx_auth__act_signcheck_strict = function(params: RemXAuth__ActSignCheckStrict_Params): asc.AtomAction {
    return ({ reg }) => {
        capi.send_restx_auth_signcheck_strict({
            body: params.rparams.body,

            config: {
                ...params.rparams.config,

                events: {
                    ...params.rparams.config?.events,

                    success: data => {
                        if (data) {
                            reg(remx_auth__state).real.input(asc.reqstate_new_fulfilled(data.acc))
                        } else {
                            reg(remx_auth__state).real.input(asc.reqstate_new_empty())
                        }

                        params.rparams.config?.events?.success?.(data)
                    },
                },
            },
        })
    }
}
