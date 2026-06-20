import type * as rest from "@fst/rest"
import { env_apiurl } from "@src/env"
import { res_event } from "@src/res/event"
import { res_new_json } from "@src/res/new/json"
import type { ApiResponse } from "@src/res/type/ApiResponse"
import type { SendConfig } from "@src/type/config"
import { fetch_new_restore } from "@src/util/fetch/new/restore"

export type SendRestX_DeliveryCityGet_Query = (
    rest.Cluster_Schema<typeof rest.restx.delivery, "city_get", "query">
)

export type SendRestX_DeliveryCityGet_Params = {
    readonly query: SendRestX_DeliveryCityGet_Query
    readonly config?: SendConfig<SendRestX_DeliveryCityGet_Result>
}

export type SendRestX_DeliveryCityGet_Result = (
    rest.Cluster_Result<typeof rest.restx.delivery, "city_get">
)

export const send_restx_delivery_city_get = function (
    params: SendRestX_DeliveryCityGet_Params
): Promise<ApiResponse<SendRestX_DeliveryCityGet_Result>> {
    const url = new URL(`${env_apiurl}/restx/delivery/city`)

    for (const key of Object.keys(params.query)) {
        const value = params.query[key as keyof typeof params.query]

        if (value !== undefined) {
            url.searchParams.append(key, JSON.stringify(value))
        }
    }

    const request = res_new_json<SendRestX_DeliveryCityGet_Result>({
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
