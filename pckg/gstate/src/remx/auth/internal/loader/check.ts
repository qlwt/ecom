import * as capi from "@fst/capi"
import * as asc from "@qyu/atom-state-core"
import { remx_auth__state } from "@src/remx/auth/internal/state"
import { v7 as uuid } from "uuid"

export const remx_auth__loader_check = asc.atomloader_new_pure({
    throttler: asc.throttler_new_microtask(),

    connect: ({ reg }) => {
        let controller_abort: AbortController | null = null

        const auth_state = reg(remx_auth__state)

        const sub = function() {
            if (controller_abort) {
                controller_abort.abort()
            }

            const data = auth_state.real.output()

            if (data.status === asc.ReqState__Status.Empty) {
                controller_abort = new AbortController()

                capi.send_restx_auth_signcheck_fallback({
                    body: {
                        fallback_id: uuid(),
                    },

                    config: {
                        signal_abort: controller_abort.signal,

                        events: {
                            success: data => {
                                if (controller_abort?.signal.aborted) { return }

                                auth_state.real.input(asc.reqstate_new_fulfilled(data.acc))
                            },
                        },
                    },
                })
            }
        }

        auth_state.real.addsub(sub)

        sub()

        return () => {
            if (controller_abort) {
                controller_abort.abort()

                controller_abort = null
            }

            auth_state.real.rmsub(sub)
        }
    },
}) 
