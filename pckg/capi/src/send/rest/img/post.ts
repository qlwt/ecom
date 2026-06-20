import * as cc from "@fst/config/client"
import type * as rest from "@fst/rest"
import { env_apiurl } from "@src/env"
import { filedef_push_formdata } from "@src/file/def/push/formdata"
import type { FileDataDef } from "@src/file/type/def"
import { res_event } from "@src/res/event"
import { res_new_json } from "@src/res/new/json"
import type { ApiResponse } from "@src/res/type/ApiResponse"
import type { SendConfig } from "@src/type/config"
import { fetch_new_restore } from "@src/util/fetch/new/restore"

export type SendRest_ImgPost_Body<TName extends keyof cc.RestImg> = (
    cc.RestImg[TName]["post"]["body"]
)

type TransformTuple<Tuple extends readonly any[], T> = {
    [K in keyof Tuple]: T
}

export type SendRest_ImgPost_FilesRaw<TName extends keyof cc.RestImg> = {
    [Field in keyof cc.RestImg[TName]["post"]["files"]]: cc.RestImg[TName]["post"]["files"][Field] extends readonly any[] ? (
        TransformTuple<cc.RestImg[TName]["post"]["files"][Field], FileDataDef>
    ) : never
}

export type SendRest_ImgPost_Files<TName extends keyof cc.RestImg> = {
    (): Promise<SendRest_ImgPost_FilesRaw<TName>>
}

export type SendRest_ImgPost_Params<TName extends keyof cc.RestImg> = {
    readonly body: SendRest_ImgPost_Body<TName>
    readonly files: SendRest_ImgPost_Files<TName>
    readonly config?: SendConfig<SendRest_ImgPost_Result<TName>>
}

export type SendRest_ImgPost_Result<TName extends keyof cc.RestImg> = (
    rest.Cluster_Result<rest.RestRoutes_Result[TName], "post">
)

export const send_rest_img_post = async function <TName extends keyof cc.RestImg>(
    table_name: TName, params: SendRest_ImgPost_Params<TName>
): Promise<ApiResponse<SendRest_ImgPost_Result<TName>>> {
    const url = new URL(`${env_apiurl}/rest/${table_name}`)
    const formdata = new FormData()
    const files = await params.files()

    for (const formdata_key of Object.keys(files)) {
        for (const filedef of files[formdata_key as keyof typeof files]) {
            filedef_push_formdata(formdata, formdata_key, filedef)
        }
    }

    const clone: Partial<typeof params.body> = {}

    for (const formdata_key of Object.keys(params.body) as (keyof typeof params.body)[]) {
        const data = params.body[formdata_key]

        if (data !== undefined) {
            clone[formdata_key] = data
        }
    }

    formdata.append("payload", JSON.stringify(clone))

    const request = res_new_json<SendRest_ImgPost_Result<TName>>({
        source: fetch_new_restore({
            hooks: params.config?.hooks,
            signal_abort: params.config?.signal_abort,

            request_new: () => fetch(url, {
                signal: params.config?.signal_abort,
                method: "POST",
                body: formdata,
                credentials: "include",
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
