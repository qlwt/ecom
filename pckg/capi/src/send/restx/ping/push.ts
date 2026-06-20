import type * as rest from "@fst/rest"
import { env_apiurl } from "@src/env"
import { res_event } from "@src/res/event"
import { res_new_json } from "@src/res/new/json"
import type { ApiResponse } from "@src/res/type/ApiResponse"
import type { SendConfig } from "@src/type/config"
import { fetch_new_restore } from "@src/util/fetch/new/restore"

export type SendRestX_PingPush_Body = (
    rest.Cluster_Schema<typeof rest.restx.ping, "push", "body">
)

export type SendRestX_PingPush_Params = {
    readonly body: SendRestX_PingPush_Body
    readonly config?: SendConfig<SendRestX_PingPush_Result>
}

export type SendRestX_PingPush_Result = (
    rest.Cluster_Result<typeof rest.restx.ping, "push">
)

export const send_restx_ping_push = function (
    params: SendRestX_PingPush_Params
): Promise<ApiResponse<SendRestX_PingPush_Result>> {
    const url = new URL(`${env_apiurl}/restx/ping/push`)

    const request = res_new_json<SendRestX_PingPush_Result>({
        source: fetch_new_restore({
            hooks: params.config?.hooks,
            signal_abort: params.config?.signal_abort,

            request_new: () => fetch(url, {
                method: "POST",
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
