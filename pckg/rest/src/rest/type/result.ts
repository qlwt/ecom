import * as cs from "@fst/config/server"
import * as eu from "@fst/express-utils"
import type { RestRoutes_DataDeleteResult, RestRoutes_DataGetResult, RestRoutes_DataPatchResult, RestRoutes_DataPostResult, RestRoutes_ImgDeleteResult, RestRoutes_ImgGetResult, RestRoutes_ImgPostResult } from "@src/rest/type/config"
import * as z from "zod"

export type RestRoutes_ResultData = {
    readonly [K in keyof cs.RestData]: {
        readonly routes: {
            readonly get: {
                readonly handler: eu.Route<RestRoutes_DataGetResult>

                readonly schema: {
                    readonly query: z.ZodType<cs.RestData[K]["get"]["query"]>
                }
            }

            readonly post: {
                readonly handler: eu.Route<RestRoutes_DataPostResult>

                readonly schema: {
                    readonly body: z.ZodType<cs.RestData[K]["post"]["body"]>
                }
            }

            readonly patch: {
                readonly handler: eu.Route<RestRoutes_DataPatchResult>

                readonly schema: {
                    readonly body: z.ZodType<cs.RestData[K]["patch"]["body"]>
                }
            }

            readonly delete: {
                readonly handler: eu.Route<RestRoutes_DataDeleteResult>

                readonly schema: {
                    readonly body: z.ZodType<cs.RestData[K]["delete"]["body"]>
                }
            }
        }
    }
}

export type RestRoutes_ResultImg = {
    readonly [K in keyof cs.RestImg]: {
        readonly routes: (
            {
                readonly get: {
                    readonly handler: eu.Route<RestRoutes_ImgGetResult>

                    readonly schema: {
                        readonly query: z.ZodType<cs.RestImg[K]["get"]["query"]>
                    }
                }

                readonly post: {
                    readonly handler: eu.Route<RestRoutes_ImgPostResult>

                    readonly schema: {
                        readonly files: z.ZodType<cs.RestImg[K]["post"]["files"]>
                        readonly body: z.ZodType<cs.RestImg[K]["post"]["body"]>
                    }
                }

                readonly delete: {
                    readonly handler: eu.Route<RestRoutes_ImgDeleteResult>

                    readonly schema: {
                        readonly body: z.ZodType<cs.RestImg[K]["delete"]["body"]>
                    }
                }
            }
        )
    }
}

export type RestRoutes_Result = (
    & RestRoutes_ResultData
    & RestRoutes_ResultImg
)
