import type { Palette_ThemeKind } from "@/src/util/palette/def"
import * as r from "react"

export type EPCtxPalette_State = {
    readonly themekind: Palette_ThemeKind
    readonly themekind_set: (themekind: Palette_ThemeKind) => void
}

export const EPCtxPalette_View = r.createContext<EPCtxPalette_State | null>(null)
