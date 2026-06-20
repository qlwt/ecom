import * as cc from "@fst/config/client"
import * as asc from "@qyu/atom-state-core"
import { nrem_act_new_data_delete } from "@src/rem/act/new/data_delete"
import { nrem_act_new_data_get } from "@src/rem/act/new/data_get"
import { nrem_act_new_data_patch } from "@src/rem/act/new/data_patch"
import { nrem_act_new_data_post } from "@src/rem/act/new/data_post"
import { nrem_act_new_data_upsert } from "@src/rem/act/new/data_upsert"
import { nrem_indexer_new } from "@src/rem/indexer/new"
import { nrem_join_new } from "@src/rem/join/new"
import { nrem_loader_new_get } from "@src/rem/loader/new/get"
import { nrem_loader_new_get_id } from "@src/rem/loader/new/get_id"
import type { Rem_Config } from "@src/rem/type/config"
import type { Rem_Index, Rem_NodeDef, Rem_Result, Rem_ResultDataKey } from "@src/rem/type/result"
import { object_new_map } from "@src/util/object/map"

export type NRem_ClusterNewData_Params = {
    readonly rem_new: () => Rem_Result
    readonly config: Rem_Config
    readonly table_def: cc.TablePublicData
    readonly table_name: keyof cc.RemDefData
}

export const nrem_cluster_new_data = function(params: NRem_ClusterNewData_Params): Rem_ResultDataKey<keyof cc.RemDefData> {
    const register = asc.atomfamily_new({
        key: (index: Rem_Index) => index.id,

        get: (index: Rem_Index) => {
            return asc.atomremnode_new<Rem_NodeDef<keyof cc.RemDefData>>({
                init: () => null,

                statics: () => ({
                    id: index.id
                })
            })
        }
    })

    return {
        register,

        indexer_new: nrem_indexer_new({
            register,
        }),

        act: {
            delete: (rparams, config = {}) => {
                return nrem_act_new_data_delete({
                    table_name: params.table_name,
                    config,
                    rparams,

                    rem_new: params.rem_new,
                    rem_config: params.config,
                })
            },

            get: (rparams, config = {}) => {
                return nrem_act_new_data_get({
                    table_name: params.table_name,
                    config,
                    rparams,

                    rem_new: params.rem_new,
                    rem_config: params.config,
                })
            },

            patch: (rparams, config = {}) => {
                return nrem_act_new_data_patch({
                    table_name: params.table_name,
                    rparams,
                    config,

                    rem_new: params.rem_new,
                    rem_config: params.config,
                })
            },

            post: (rparams, config = {}) => {
                return nrem_act_new_data_post({
                    table_name: params.table_name,
                    config,
                    rparams,

                    rem_new: params.rem_new,
                    rem_config: params.config,
                })
            },

            upsert: (rparams, config = {}) => {
                return nrem_act_new_data_upsert({
                    table_name: params.table_name,
                    config,
                    rparams,

                    rem_new: params.rem_new,
                    rem_config: params.config,
                })
            },
        },

        joins: object_new_map(params.table_def.joins, (_, variant_name) => {
            return nrem_join_new({
                rem_new: params.rem_new,
                table_name: params.table_name,
                self_variant: variant_name as "core",
            })
        }),

        loaders: {
            get: nrem_loader_new_get({
                table_name: params.table_name,
                rem_new: params.rem_new,
                config: params.config,
            }),

            get_id: nrem_loader_new_get_id({
                table_name: params.table_name,
                rem_new: params.rem_new,
                config: params.config,
            }),
        },
    }
}
