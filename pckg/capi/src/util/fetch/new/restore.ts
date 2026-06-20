import * as cst from "@fst/cst"
import type * as rest from "@fst/rest"
import { env_apiurl } from "@src/env"

export type Fetch_NewRestore_Hooks = {
    readonly noauth?: VoidFunction
    readonly restore?: (params: NonNullable<rest.Cluster_Result<typeof rest.restx["auth"], "signcheck_strict">>) => void
}

export type Fetch_NewRestore_Params = {
    readonly signal_abort?: AbortSignal
    readonly hooks?: Fetch_NewRestore_Hooks
    readonly request_new: () => Promise<Response>
}

export const fetch_new_restore = function(params: Fetch_NewRestore_Params): Promise<Response> {
    return new Promise((resolve, reject) => {
        const request = params.request_new()

        request.then(response => {
            if (response.status === 401) {
                const url = new URL(`${env_apiurl}/restx/auth/signcheck/strict`)

                const restore = fetch(url, {
                    method: "POST",
                    credentials: "include",
                    body: JSON.stringify({}),
                    signal: params.signal_abort,

                    headers: {
                        "Content-Type": "application/json"
                    },
                })

                restore.then((response) => {
                    if (params.signal_abort?.aborted) { return }

                    return response.json() as Promise<rest.Cluster_Result<typeof rest.restx["auth"], "signcheck_strict">>
                }, (message) => {
                    if (params.signal_abort?.aborted) { return }

                    reject(message)
                }).then(json => {
                    if (params.signal_abort?.aborted) { return }

                    if (!json) {
                        params.hooks?.noauth?.()

                        reject(cst.ServerError.NoAuth)
                    } else {
                        params.hooks?.restore?.(json)

                        params.request_new().then(response => {
                            if (params.signal_abort?.aborted) { return }

                            resolve(response)
                        }, (message) => {
                            if (params.signal_abort?.aborted) { return }

                            reject(message)
                        })
                    }
                })
            } else {
                resolve(response)
            }
        }, message => {
            reject(message)
        })
    })
}
