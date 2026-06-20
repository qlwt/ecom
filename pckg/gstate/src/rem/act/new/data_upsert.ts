import * as cc from "@fst/config/client"
import * as asc from "@qyu/atom-state-core"
import { nrem_act_new_data_patch } from "@src/rem/act/new/data_patch"
import { nrem_act_new_data_post } from "@src/rem/act/new/data_post"
import type { Rem_Config } from "@src/rem/type/config"
import type { Rem_DataActUpsert_Config, Rem_DataActUpsert_RParams, Rem_Result } from "@src/rem/type/result"

export type NRemAct_NewDataUpsert_Params<TName extends keyof cc.RemDefData> = {
    readonly table_name: TName
    readonly config: Rem_DataActUpsert_Config
    readonly rparams: Rem_DataActUpsert_RParams<TName>

    readonly rem_config: Rem_Config
    readonly rem_new: () => Rem_Result
}

export const nrem_act_new_data_upsert = function <TName extends keyof cc.RemDefData>(
    params: NRemAct_NewDataUpsert_Params<TName>
): asc.AtomAction {
    return ({ reg }) => {
        const rem = params.rem_new()
        const table_rem = rem[params.table_name as "item"]
        const table_register = reg(table_rem.register)
        const table_node = table_register.reg({ id: params.rparams.patch.body.id, })

        if (table_node.real.output().status === asc.ReqState__Status.Empty) {
            reg(nrem_act_new_data_post({
                config: params.config,
                table_name: params.table_name,
                rparams: params.rparams.post_new(params.rparams.patch),

                rem_new: params.rem_new,
                rem_config: params.rem_config,
            }))
        } else {
            reg(nrem_act_new_data_patch({
                table_name: params.table_name,
                rparams: params.rparams.patch,
                config: params.config,

                rem_new: params.rem_new,
                rem_config: params.rem_config,
            }))
        }
    }
}
