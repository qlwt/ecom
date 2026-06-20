import * as cc from "@fst/config/client"
import * as asc from "@qyu/atom-state-core"
import { nrem_act_new_data_get } from "@src/rem/act/new/data_get"
import type { Rem_Config } from "@src/rem/type/config"
import type { Rem_LoaderGetId_Index, Rem_Result } from "@src/rem/type/result"

const stringify_stable = function(value: unknown): string {
    if (typeof value !== "object" || value === null) {
        return JSON.stringify(value)
    }

    if (Array.isArray(value)) {
        return `[${value.map(child => stringify_stable(child)).join(", ")}]`
    }

    const keys = Object.keys(value).sort()
    const pairs = keys.map(key => `${JSON.stringify(key)}: ${stringify_stable(value[key as keyof typeof value])}`)

    return `{ ${pairs.join(", ")} }`
}

export type NRem_LoaderNewGetId_Params<TName extends keyof cc.RestData> = {
    readonly table_name: TName
    readonly config: Rem_Config
    readonly rem_new: () => Rem_Result
}

export const nrem_loader_new_get_id = function <TName extends keyof cc.RestData>(
    params: NRem_LoaderNewGetId_Params<TName>
) {
    return asc.atomfamily_new({
        key: (index: Rem_LoaderGetId_Index<TName>) => {
            return stringify_stable(index)
        },

        get: ({ id, ...query }: Rem_LoaderGetId_Index<TName>) => {
            return asc.atomloader_new_pure({
                throttler: asc.throttler_new_microtask(),

                connect: ({ reg }) => {
                    const controller_abort = new AbortController()

                    reg(nrem_act_new_data_get({
                        rem_config: params.config,
                        rem_new: params.rem_new,

                        config: {},
                        table_name: params.table_name,

                        rparams: {
                            query: {
                                ...query,

                                limit: 1,
                                cursor: id,
                            },

                            config: {
                                signal_abort: controller_abort.signal,
                            },
                        },
                    }))

                    return () => {
                        controller_abort.abort()
                    }
                }
            })
        }
    })
}
