import * as asc from "@qyu/atom-state-core"
import type { GVReport_State } from "@src/gv/report/type/state"

export const gv_report__state = asc.atomstate_new<readonly GVReport_State[]>(() => {
    return []
})
