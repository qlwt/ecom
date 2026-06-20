import type { FnSetterStateful } from "@qyu/reactcmp-dropdown"
import * as r from "react"

export type ELConEdit_MarkState_State = {
    readonly open: boolean
    readonly open_set: FnSetterStateful<boolean>
}

export const ELConEdit_MarkState = r.createContext<ELConEdit_MarkState_State | null>(null)
