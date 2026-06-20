import * as cc from "@fst/config/client"
import type * as rest from "@fst/rest"
import { env_apiurl } from "@src/env"
import { res_event } from "@src/res/event"
import { res_new_json } from "@src/res/new/json"
import type { ApiResponse } from "@src/res/type/ApiResponse"
import type { SendConfig } from "@src/type/config"
import { fetch_new_restore } from "@src/util/fetch/new/restore"

export type SendRest_DataGet_Query<TName extends keyof cc.RestData> = (
    cc.RestData[TName]["get"]["query"]
)

export type SendRest_DataGet_Params<TName extends keyof cc.RestData> = {
    readonly query: SendRest_DataGet_Query<TName>
    readonly config?: SendConfig<SendRest_DataGet_Result<TName>>
}

export type SendRest_DataGet_Result<TName extends keyof cc.RestData> = (
    rest.Cluster_Result<rest.RestRoutes_Result[TName], "get">
)

export const send_rest_data_get = function <TName extends keyof cc.RestData>(
    table_name: TName, params: SendRest_DataGet_Params<TName>
): Promise<ApiResponse<SendRest_DataGet_Result<TName>>> {
    const url = new URL(`${env_apiurl}/rest/${table_name}`)

    for (const key of Object.keys(params.query)) {
        const value = params.query[key as keyof typeof params.query]

        if (value !== undefined) {
            url.searchParams.append(key, JSON.stringify(value))
        }
    }

    const request = res_new_json<SendRest_DataGet_Result<TName>>({
        source: fetch_new_restore({
            hooks: params.config?.hooks,
            signal_abort: params.config?.signal_abort,

            request_new: () => fetch(url, {
                method: "GET",
                credentials: "include",
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
