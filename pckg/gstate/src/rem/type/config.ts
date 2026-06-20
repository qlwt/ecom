import * as capi from "@fst/capi"
import * as cc from "@fst/config/client"

export type Rem_ConfigData_NodeConvert_Config = {
    readonly creation_date: number
}

export type Rem_ConfigData = {
    [TName in keyof cc.RestData]: {
        readonly node_convert: {
            (
                node: cc.RestData[TName]["post"]["body"][number]["core"],
                config: Rem_ConfigData_NodeConvert_Config
            ): cc.RemDefData[TName]["data"]
        }
    }
}

export type Rem_ConfigImg_NodeConvert_Extra<TName extends keyof cc.RestImg> = {
    readonly files: capi.SendRest_ImgPost_FilesRaw<TName> | null
}

export type Rem_ConfigImg_NodeConvert_Config = {
    readonly creation_date: number
}

export type Rem_ConfigImg = {
    [TName in keyof cc.RestImg]: {
        readonly node_convert: {
            (
                node: cc.RestImg[TName]["post"]["body"],
                config: Rem_ConfigImg_NodeConvert_Config,
                extra?: Rem_ConfigImg_NodeConvert_Extra<TName>,
            ): cc.RemDefImg[TName]["data"]
        }
    }
}

export type Rem_Config = (
    & Rem_ConfigImg
    & Rem_ConfigData
)
