import type * as rest from "@fst/rest"
import { env_apiurl } from "@src/env"
import { res_event } from "@src/res/event"
import { res_new_json } from "@src/res/new/json"
import type { ApiResponse } from "@src/res/type/ApiResponse"
import type { SendConfig } from "@src/type/config"

export type SendRestX_AuthSignCheckStrict_Body = (
    rest.Cluster_Schema<typeof rest.restx.auth, "signcheck_strict", "body">
)

export type SendRestX_AuthSignCheckStrict_Params = {
    readonly body: SendRestX_AuthSignCheckStrict_Body
    readonly config?: SendConfig<SendRestX_AuthSignCheckStrict_Result>
}

export type SendRestX_AuthSignCheckStrict_Result = (
    rest.Cluster_Result<typeof rest.restx.auth, "signcheck_strict">
)

export const send_restx_auth_signcheck_strict = function(
    params: SendRestX_AuthSignCheckStrict_Params
): Promise<ApiResponse<SendRestX_AuthSignCheckStrict_Result>> {
    const url = new URL(`${env_apiurl}/restx/auth/signcheck/strict`)

    const request = res_new_json<SendRestX_AuthSignCheckStrict_Result>({
        source: fetch(url, {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(params.body),
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
