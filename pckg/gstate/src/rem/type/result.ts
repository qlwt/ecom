import * as capi from "@fst/capi"
import * as cc from "@fst/config/client"
import * as asc from "@qyu/atom-state-core"
import * as sc from "@qyu/signal-core"

export type Rem_Statics = {
    readonly id: string
}

export type Rem_Index = {
    readonly id: string
}

export interface Rem_NodeDef<K extends keyof cc.RemDef> extends asc.AtomRemNode_Def {
    data: cc.RemDef[K]["data"]
    statics: Rem_Statics
}

export interface Rem_NodeDefStandalone<K extends keyof cc.RemDef> extends asc.AtomRemNode_Def {
    data: cc.RemDef[K]["data"]
    statics: {}
}

export type Rem_Node<K extends keyof cc.RemDef> = asc.AtomRemNode_Value<Rem_NodeDef<K>>
export type Rem_NodeStandalone<K extends keyof cc.RemDef> = asc.AtomRemNode_Value<Rem_NodeDefStandalone<K>>

export type Rem_Indexer<Def extends asc.AtomRemNode_Def, Fields extends readonly (keyof Def["data"])[]> = (
    asc.AtomFamily_Value<
        Pick<Def["data"], Fields[number]>,
        sc.OSignal<ReadonlySet<asc.AtomRemNode_Value<Def>>>
    >
)

export type Rem_IndexerBuilder<Def extends asc.AtomRemNode_Def> = {
    <Fields extends readonly (keyof Def["data"])[]>(fields: Fields): asc.AtomSelectorStatic<Rem_Indexer<Def, Fields>>
}

export type Rem_JoinData<K extends keyof cc.RemDef, V extends keyof cc.RemDef[K]["joins"] = "core"> = (
    Extract<cc.RemDef[K]["joins"][V], {}>
)

export type Rem_PostCore<K extends keyof cc.Rest> = (
    | K extends keyof cc.RestData ? cc.RestData[K]["post"]["body"][number]["core"] : never
    | K extends keyof cc.RestImg ? cc.RestImg[K]["post"]["body"] : never
)

export type Rem_PostJoins<K extends keyof cc.RestData> = (
    cc.RestData[K]["post"]["body"][number]["joins"]
)

export type Rem_Patch<K extends keyof cc.RestData> = (
    cc.RestData[K]["patch"]["body"]["patch"]
)

export type Rem_Join<K extends keyof cc.RemDef, V extends keyof cc.RemDef[K]["joins"]> = asc.AtomRemNode_Join<{
    data: Rem_JoinData<K, V>
    statics: Rem_Statics
    request_meta: any
    request_result: any
}, {}>

export type Rem_JoinFactory<K extends keyof cc.RemDef, V extends keyof cc.RemDef[K]["joins"]> = {
    (): asc.AtomRemNode_Join_Factory<Rem_Index, Rem_Join<K, V>>
}

export type Rem_JoinStandalone<K extends keyof cc.RemDef, V extends keyof cc.RemDef[K]["joins"]> = asc.AtomRemNode_Join<{
    data: Extract<cc.RemDef[K]["joins"][V], {}>
    statics: {}
    request_meta: any
    request_result: any
}, {}>

export type Rem_JoinStandaloneFactory<K extends keyof cc.RemDef, V extends keyof cc.RemDef[K]["joins"]> = {
    (): asc.AtomRemNode_Join_Factory<{}, Rem_JoinStandalone<K, V>>
}

export type Rem_LoaderGetId_Index<K extends keyof cc.RestData> = (
    & Rem_Index
    & Omit<capi.SendRest_DataGet_Query<K>, "limit" | "cursor">
)

export type Rem_LoaderGet_Index<K extends keyof cc.RestData> = (
    & Omit<capi.SendRest_DataGet_Query<K>, "limit" | "cursor">
)

export type Rem_ImgActPost_RParams<K extends keyof cc.RestImg> = (
    & Omit<capi.SendRest_ImgPost_Params<K>, "files">
    & {
        readonly files_raw: capi.SendRest_ImgPost_FilesRaw<K>
        readonly files_process: (files: capi.SendRest_ImgPost_FilesRaw<K>) => Promise<capi.SendRest_ImgPost_FilesRaw<K>>
    }
)

export type Rem_ImgActDelete_RParams<K extends keyof cc.RestImg> = (
    capi.SendRest_ImgDelete_Params<K>
)

export type Rem_ImgActPost_Config = {
    readonly deps?: readonly asc.AtomRemNode_Value<any>[]
}

export type Rem_ImgActDelete_Config = {
    readonly deps?: readonly asc.AtomRemNode_Value<any>[]
}

export type Rem_ResultImgKey<K extends keyof cc.RestImg> = {
    readonly register: asc.AtomFamily<Rem_Index, Rem_Node<K>>
    readonly indexer_new: Rem_IndexerBuilder<Rem_NodeDef<K>>

    readonly act: {
        readonly post: (params: Rem_ImgActPost_RParams<K>, config?: Rem_ImgActPost_Config) => asc.AtomAction
        readonly delete: (params: Rem_ImgActDelete_RParams<K>, config?: Rem_ImgActDelete_Config) => asc.AtomAction
    }

    readonly loaders: {
    }

    readonly joins: {
        [V in keyof cc.RemDef[K]["joins"]]: Rem_JoinFactory<K, V>
    }
}

export type Rem_ResultImg = {
    [K in keyof cc.RestImg]: Rem_ResultImgKey<K>
}

export type Rem_DataActGet_RParams<K extends keyof cc.RestData> = (
    capi.SendRest_DataGet_Params<K>
)

export type Rem_DataActPost_RParams<K extends keyof cc.RestData> = (
    capi.SendRest_DataPost_Params<K>
)

export type Rem_DataActPatch_RParams<K extends keyof cc.RestData> = (
    capi.SendRest_DataPatch_Params<K>
)

export type Rem_DataActDelete_RParams<K extends keyof cc.RestData> = (
    capi.SendRest_DataDelete_Params<K>
)

export type Rem_DataActUpsert_RParams<K extends keyof cc.RestData> = {
    readonly patch: capi.SendRest_DataPatch_Params<K>
    readonly post_new: (patch_rparams: capi.SendRest_DataPatch_Params<K>) => capi.SendRest_DataPost_Params<K>
}

export type Rem_DataActGet_Config = {
    readonly deps?: readonly asc.AtomRemNode_Value<any>[]
}

export type Rem_DataActPost_Config = {
    readonly deps?: readonly asc.AtomRemNode_Value<any>[]
}

export type Rem_DataActPatch_Config = {
    readonly deps?: readonly asc.AtomRemNode_Value<any>[]
}

export type Rem_DataActDelete_Config = {
    readonly deps?: readonly asc.AtomRemNode_Value<any>[]
}

export type Rem_DataActUpsert_Config = {
    readonly deps?: readonly asc.AtomRemNode_Value<any>[]
}

export type Rem_ResultDataKey<K extends keyof cc.RestData> = {
    readonly register: asc.AtomFamily<Rem_Index, Rem_Node<K>>
    readonly indexer_new: Rem_IndexerBuilder<Rem_NodeDef<K>>

    readonly act: {
        readonly get: (params: Rem_DataActGet_RParams<K>, config?: Rem_DataActGet_Config) => asc.AtomAction
        readonly post: (params: Rem_DataActPost_RParams<K>, config?: Rem_DataActPost_Config) => asc.AtomAction
        readonly patch: (params: Rem_DataActPatch_RParams<K>, config?: Rem_DataActPatch_Config) => asc.AtomAction
        readonly delete: (params: Rem_DataActDelete_RParams<K>, config?: Rem_DataActDelete_Config) => asc.AtomAction
        readonly upsert: (params: Rem_DataActUpsert_RParams<K>, config?: Rem_DataActUpsert_Config) => asc.AtomAction
    }

    readonly loaders: {
        readonly get: asc.AtomFamily<Rem_LoaderGet_Index<K>, asc.AtomLoader_Value<[]>>
        readonly get_id: asc.AtomFamily<Rem_LoaderGetId_Index<K>, asc.AtomLoader_Value<[]>>
    }

    readonly joins: {
        [V in keyof cc.RemDef[K]["joins"]]: Rem_JoinFactory<K, V>
    }
}

export type Rem_ResultData = {
    [K in keyof cc.RestData]: Rem_ResultDataKey<K>
}

export type Rem_Result = (
    & Rem_ResultImg
    & Rem_ResultData
)
