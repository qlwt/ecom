import * as cc from "@fst/config/client"
import type * as rest from "@fst/rest"
import { env_apiurl } from "@src/env"
import { res_event } from "@src/res/event"
import { res_new_json } from "@src/res/new/json"
import type { ApiResponse } from "@src/res/type/ApiResponse"
import type { SendConfig } from "@src/type/config"
import { fetch_new_restore } from "@src/util/fetch/new/restore"

export type SendRest_ImgDelete_Body<TName extends keyof cc.RestImg> = (
    cc.RestImg[TName]["delete"]["body"]
)

export type SendRest_ImgDelete_Params<TName extends keyof cc.RestImg> = {
    readonly body: SendRest_ImgDelete_Body<TName>
    readonly config?: SendConfig<SendRest_ImgDelete_Result<TName>>
}

export type SendRest_ImgDelete_Result<TName extends keyof cc.RestImg> = (
    rest.Cluster_Result<rest.RestRoutes_Result[TName], "delete">
)

export const send_rest_img_delete = function <TName extends keyof cc.RestImg>(
    table_name: TName, params: SendRest_ImgDelete_Params<TName>
): Promise<ApiResponse<SendRest_ImgDelete_Result<TName>>> {
    const url = new URL(`${env_apiurl}/rest/${table_name}`)

    const request = res_new_json<SendRest_ImgDelete_Result<TName>>({
        source: fetch_new_restore({
            hooks: params.config?.hooks,
            signal_abort: params.config?.signal_abort,

            request_new: () => fetch(url, {
                method: "DELETE",
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
