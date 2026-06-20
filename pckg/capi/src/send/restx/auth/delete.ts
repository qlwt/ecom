import type * as rest from "@fst/rest"
import { env_apiurl } from "@src/env"
import { res_event } from "@src/res/event"
import { res_new_json } from "@src/res/new/json"
import type { ApiResponse } from "@src/res/type/ApiResponse"
import type { SendConfig } from "@src/type/config"
import { fetch_new_restore } from "@src/util/fetch/new/restore"

export type SendRestX_AuthDelete_Body = (
    rest.Cluster_Schema<typeof rest.restx.auth, "delete", "body">
)

export type SendRestX_AuthDelete_Params = {
    readonly body: SendRestX_AuthDelete_Body
    readonly config?: SendConfig<SendRestX_AuthDelete_Result>
}

export type SendRestX_AuthDelete_Result = (
    rest.Cluster_Result<typeof rest.restx.auth, "delete">
)

export const send_restx_auth_delete = function (
    params: SendRestX_AuthDelete_Params
): Promise<ApiResponse<SendRestX_AuthDelete_Result>> {
    const url = new URL(`${env_apiurl}/restx/auth/delete`)

    const request = res_new_json<SendRestX_AuthDelete_Result>({
        source: fetch_new_restore({
            hooks: params.config?.hooks,
            signal_abort: params.config?.signal_abort,

            request_new: () => fetch(url, {
                method: "DELETE",
                credentials: "include",
                body: JSON.stringify(params.body),
                signal: params.config?.signal_abort,

                headers: {
                    "Content-Type": "application/json",
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
