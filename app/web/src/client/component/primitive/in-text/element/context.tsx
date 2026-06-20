import type { EPInText_State } from "@src/client/component/primitive/in-text/type/state"
import * as r from "react"

export const EPInText_Context = r.createContext<EPInText_State | null>(null)
