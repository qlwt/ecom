import type { Palette_Color } from "@/src/util/palette/type/color";

export const palette_color_format_rgba = function (color: Palette_Color, a: number): string {
    return `rgba(${color.rgb[0]}, ${color.rgb[1]}, ${color.rgb[2]}, ${a})`
}
