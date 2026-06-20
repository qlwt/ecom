import type * as rest from "@fst/rest"
import { env_apiurl } from "@src/env"
import { res_event } from "@src/res/event"
import { res_new_json } from "@src/res/new/json"
import type { ApiResponse } from "@src/res/type/ApiResponse"
import type { SendConfig } from "@src/type/config"
import { fetch_new_restore } from "@src/util/fetch/new/restore"

export type SendRestX_AuthMatchEmailPatch_Body = (
    rest.Cluster_Schema<typeof rest.restx.auth, "match_email_patch", "body">
)

export type SendRestX_AuthMatchEmailPatch_Params = {
    readonly body: SendRestX_AuthMatchEmailPatch_Body
    readonly config?: SendConfig<SendRestX_AuthMatchEmailPatch_Result>
}

export type SendRestX_AuthMatchEmailPatch_Result = (
    rest.Cluster_Result<typeof rest.restx.auth, "match_email_patch">
)

export const send_restx_auth_match_email_patch = function (
    params: SendRestX_AuthMatchEmailPatch_Params
): Promise<ApiResponse<SendRestX_AuthMatchEmailPatch_Result>> {
    const url = new URL(`${env_apiurl}/restx/auth/match/email`)

    const request = res_new_json<SendRestX_AuthMatchEmailPatch_Result>({
        source: fetch_new_restore({
            hooks: params.config?.hooks,
            signal_abort: params.config?.signal_abort,

            request_new: () => fetch(url, {
                method: "PATCH",
                credentials: "include",
                body: JSON.stringify(params.body),
                signal: params.config?.signal_abort,

                headers: {
                    "Content-Type": "application/json"
                },
            }),
        })
    })

    if (params.config?.events) {
        res_event({
            request,
            events: params.config.events,
        })
    }

    return request
}

