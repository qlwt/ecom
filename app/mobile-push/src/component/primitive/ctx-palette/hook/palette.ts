import { EPCtxPalette_View } from "@/src/component/primitive/ctx-palette/element/view";
import { palette_def } from "@/src/util/palette/def";
import * as r from "react"

export const usePalette = function (): (typeof palette_def)[keyof typeof palette_def] {
    const state = r.useContext(EPCtxPalette_View)

    if (state === null) {
        throw new Error(`Using Palette outsize of Palette Context`)
    }

    return palette_def[state.themekind]
}
