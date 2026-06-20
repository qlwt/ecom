import type { Palette_Color } from "@/src/util/palette/type/color"

export const palette_color_new = function(r: number, g: number, b: number): Palette_Color {
    return {
        rgb: [r, g, b],
        hex: `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
    }
}
