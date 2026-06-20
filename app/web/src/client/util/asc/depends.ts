import * as asc from "@qyu/atom-state-core"
import * as sc from "@qyu/signal-core"

type RequestState = {
    controller_abort: AbortController
}

export type ASC__Depends_Action_Params = {
    readonly signal_abort: AbortSignal
    readonly cleanup: VoidFunction
}

export type ASC__Depends_Params = {
    readonly deps: readonly asc.AtomRemNode_Value<any>[]
    readonly action: (params: ASC__Depends_Action_Params) => void
    readonly signal_abort?: AbortSignal | undefined
}

const abort_merge = function(src: readonly (AbortSignal | undefined | null)[]): AbortSignal {
    return AbortSignal.any(src.filter((n): n is AbortSignal => Boolean(n)))
}

export const asc_depends = function <PrR>(params: ASC__Depends_Params) {
    const controller_abort = new AbortController()
    const signal_abort = abort_merge([controller_abort.signal, params.signal_abort])

    const deps_real_s = sc.osignal_new_merge(params.deps.map(dep => dep.real))

    return new Promise((resolve, reject) => {
        if (signal_abort.aborted) {
            reject(new Error("aborted"))
        }

        let request: RequestState | null = null

        const abort = () => {
            deps_real_s.rmsub(sub)
            signal_abort.removeEventListener("abort", abort)

            if (request) {
                const l_request = request

                request = null

                l_request.controller_abort.abort()
            }

            reject(new Error("aborted"))
        }

        const sub = () => {
            const deps_real = deps_real_s.output()

            for (const dep_real of deps_real) {
                switch (dep_real.status) {
                    case asc.ReqState__Status.Empty: {
                        deps_real_s.rmsub(sub)
                        signal_abort.removeEventListener("abort", abort)

                        if (request) {
                            const l_request = request

                            request = null

                            l_request.controller_abort.abort()
                        }

                        reject(new Error(`Waiting for dependencies: one of dependencies is empty`))

                        return
                    }
                    case asc.ReqState__Status.Pending:
                        if (request) {
                            const l_request = request

                            request = null

                            l_request.controller_abort.abort()
                        }

                        // not ready
                        return
                    case asc.ReqState__Status.Fulfilled:
                        continue
                }
            }

            const l_controller_abort = new AbortController()

            params.action({
                signal_abort: abort_merge([l_controller_abort.signal, signal_abort]),

                cleanup: () => {
                    if (!l_controller_abort.signal.aborted) {
                        deps_real_s.rmsub(sub)
                        signal_abort.removeEventListener("abort", abort)
                    }
                }
            })

            request = {
                controller_abort: l_controller_abort,
            }
        }

        signal_abort.addEventListener("abort", abort)
        deps_real_s.addsub(sub)

        sub()
    })
}
