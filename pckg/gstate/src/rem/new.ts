import * as cc from "@fst/config/client"
import { object_new_map } from "@src/util/object/map"
import { nrem_cluster_new_data } from "@src/rem/cluster/new/data"
import { nrem_cluster_new_img } from "@src/rem/cluster/new/img"
import type { Rem_Config } from "@src/rem/type/config"
import type { Rem_Result } from "@src/rem/type/result"

export const rem_new = function(config: Rem_Config): Rem_Result {
    const result = object_new_map(cc.remdef, (table_def, table_name) => {
        switch (table_def.kind) {
            case "img":
                return nrem_cluster_new_img({
                    rem_new: () => result,
                    config,
                    table_def: table_def as cc.TablePublicImg,
                    table_name: table_name as keyof cc.RestImg,
                })
            case "data":
                return nrem_cluster_new_data({
                    rem_new: () => result,
                    config,
                    table_def: table_def as cc.TablePublicData,
                    table_name: table_name as keyof cc.RestData,
                })
        }
    }) as Rem_Result

    return result
}
