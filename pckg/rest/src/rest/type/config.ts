import * as cs from "@fst/config/server"
import * as eu from "@fst/express-utils"
import type { Database_Slice } from "@src/db/type/dbslice"
import * as ksly from "kysely"

export type RestRoutes_DataPatchResult = null
export type RestRoutes_DataDeleteResult = null

export type RestRoutes_DataPostResult = {
    readonly creation_date: number
}

export type RestRoutes_DataGetResult = {
    readonly count_total: number
    readonly cursor: string | null
    readonly slice: Database_Slice
}

export type RestRoutes_ImgDeleteResult = null

export type RestRoutes_ImgPostResult = {
    readonly creation_date: number
}

export type RestRoutes_ImgGetResult = NonSharedBuffer

export type RestRoutes_AccessCheck = {
    (acc: cs.Database["acc"]): Promise<boolean>
}

export type RestRoutes_DataConfig_PostNodeConvertConfig = {
    readonly creation_date: number
}

export type RestRoutes_ParentQuery = {
    [K in keyof cs.Rest]: {
        readonly table: K
        readonly query: cs.Rest[K]["get"]["query"]
    }
}[keyof cs.Rest]

export type RestRoutes_DataConfigProp<K extends keyof cs.RestData> = {
    readonly get: {
        readonly access_skip?: {
            (query: cs.RestData[K]["get"]["query"]): Promise<boolean>
        }

        readonly access_check?: {
            (query: cs.RestData[K]["get"]["query"]): Promise<readonly RestRoutes_AccessCheck[]>
        }

        readonly fseq_new: {
            (query: cs.RestData[K]["get"]["query"]): Promise<ksly.RawBuilder<unknown> | null>
        }

        readonly fseq_new_child: {
            (query: RestRoutes_ParentQuery): Promise<ksly.RawBuilder<unknown> | null>
        },

        readonly limit_new: {
            (query: cs.RestData[K]["get"]["query"]): Promise<number | null>
        }
    }

    readonly post: {
        readonly access_skip?: {
            (body: cs.RestData[K]["post"]["body"]): Promise<boolean>
        }

        readonly access_check?: {
            (body: cs.RestData[K]["post"]["body"]): Promise<readonly RestRoutes_AccessCheck[]>
        }

        readonly node_convert: {
            (
                input: cs.RestData[K]["post"]["body"][number]["core"],
                config: RestRoutes_DataConfig_PostNodeConvertConfig
            ): Promise<cs.Database[K]>
        }
    }

    readonly patch?: {
        readonly access_skip?: {
            (body: cs.RestData[K]["patch"]["body"]): Promise<boolean>
        }

        readonly access_check?: {
            (body: cs.RestData[K]["patch"]["body"]): Promise<readonly RestRoutes_AccessCheck[]>
        }
    }

    readonly delete?: {
        readonly access_skip?: {
            (body: cs.RestData[K]["delete"]["body"]): Promise<boolean>
        }

        readonly access_check?: {
            (body: cs.RestData[K]["delete"]["body"]): Promise<readonly RestRoutes_AccessCheck[]>
        }
    }
}

export type RestRoutes_DataConfig = {
    readonly [K in keyof cs.RestData]: RestRoutes_DataConfigProp<K>
}

export type RestRoutes_ImgConfig_PostNodeConvertConfig = {
    readonly creation_date: number
}

export type RestRoutes_ImgConfig_PostVariantConvertConfig = {
    readonly area: number
    readonly filename: string
    readonly mimetype: string
    readonly creation_date: number
}

export type RestRoutes_ImgConfigProp<K extends keyof cs.RestImg> = {
    readonly get: {
        readonly access_skip?: {
            (query: cs.RestImg[K]["get"]["query"]): Promise<boolean>
        }

        readonly access_check?: {
            (query: cs.RestImg[K]["get"]["query"]): Promise<readonly RestRoutes_AccessCheck[]>
        }

        readonly area_new: {
            (query: cs.RestImg[K]["get"]["query"]): Promise<number>
        }

        readonly fseq_new: {
            (query: cs.RestImg[K]["get"]["query"]): Promise<ksly.RawBuilder<unknown> | null>
        }

        readonly fseq_new_child: {
            (query: RestRoutes_ParentQuery): Promise<ksly.RawBuilder<unknown> | null>
        },
    }

    readonly post: {
        readonly access_skip?: {
            (body: cs.RestImg[K]["post"]["body"]): Promise<boolean>
        }

        readonly access_check?: {
            (body: cs.RestImg[K]["post"]["body"]): Promise<readonly RestRoutes_AccessCheck[]>
        }

        readonly file_new: {
            (files: cs.RestImg[K]["post"]["files"]): Promise<eu.MulterFile>
        }

        readonly node_convert: {
            (
                input: cs.RestImg[K]["post"]["body"],
                config: RestRoutes_ImgConfig_PostNodeConvertConfig
            ): Promise<cs.Database[K]>
        }

        readonly variant_convert: {
            (
                input: cs.RestImg[K]["post"]["body"],
                config: RestRoutes_ImgConfig_PostVariantConvertConfig
            ): Promise<cs.Database[`${K}_variant`]>
        }
    }

    readonly delete?: {
        readonly access_skip?: {
            (body: cs.RestImg[K]["delete"]["body"]): Promise<boolean>
        }

        readonly access_check?: {
            (body: cs.RestImg[K]["delete"]["body"]): Promise<readonly RestRoutes_AccessCheck[]>
        }
    }
}

export type RestRoutes_ImgConfig = {
    readonly [K in keyof cs.RestImg]: RestRoutes_ImgConfigProp<K>
}

export type RestRoutes_Config = (
    & RestRoutes_ImgConfig
    & RestRoutes_DataConfig
)
