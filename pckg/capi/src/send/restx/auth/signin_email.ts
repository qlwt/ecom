import type * as rest from "@fst/rest"
import { env_apiurl } from "@src/env"
import { res_event } from "@src/res/event"
import { res_new_json } from "@src/res/new/json"
import type { ApiResponse } from "@src/res/type/ApiResponse"
import type { SendConfig } from "@src/type/config"

export type SendRestX_AuthSignInEmail_Body = (
    rest.Cluster_Schema<typeof rest.restx.auth, "signin_email", "body">
)

export type SendRestX_AuthSignInEmail_Params = {
    readonly body: SendRestX_AuthSignInEmail_Body
    readonly config?: SendConfig<SendRestX_AuthSignInEmail_Result>
}

export type SendRestX_AuthSignInEmail_Result = (
    rest.Cluster_Result<typeof rest.restx.auth, "signin_email">
)

export const send_restx_auth_signin_email = function(
    params: SendRestX_AuthSignInEmail_Params
): Promise<ApiResponse<SendRestX_AuthSignInEmail_Result>> {
    const url = new URL(`${env_apiurl}/restx/auth/signin/email`)

    const request = res_new_json<SendRestX_AuthSignInEmail_Result>({
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
