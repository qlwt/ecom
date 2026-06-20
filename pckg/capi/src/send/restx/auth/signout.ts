import type * as rest from "@fst/rest"
import { env_apiurl } from "@src/env"
import { res_event } from "@src/res/event"
import { res_new_json } from "@src/res/new/json"
import type { ApiResponse } from "@src/res/type/ApiResponse"
import type { SendConfig } from "@src/type/config"

export type SendRestX_AuthSignOut_Params = {
    readonly config?: SendConfig<SendRestX_AuthSignOut_Result>
}

export type SendRestX_AuthSignOut_Result = (
    rest.Cluster_Result<typeof rest.restx.auth, "signout">
)

export const send_restx_auth_signout = function(
    params: SendRestX_AuthSignOut_Params
): Promise<ApiResponse<SendRestX_AuthSignOut_Result>> {
    const url = new URL(`${env_apiurl}/restx/auth/signout`)

    const request = res_new_json<SendRestX_AuthSignOut_Result>({
        source: fetch(url, {
            method: "POST",
            credentials: "include",
            signal: params.config?.signal_abort,

            headers: {
                "Content-Type": "application/json"
            },
        }),
    })

    if (params.config?.events) {
        res_event({
            request,
            events: params.config.events,
        })
    }

    return request
}
