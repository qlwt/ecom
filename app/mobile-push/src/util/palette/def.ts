import { palette_color_new } from "@/src/util/palette/color_new"

export enum Palette_ThemeKind {
    Primary
}

export type Palette_Theme = (
    typeof palette_def[Palette_ThemeKind]
)

export const palette_def = {
    [Palette_ThemeKind.Primary]: {
        base: {
            bg_0800: palette_color_new(255, 255, 255),
            bg_0900: palette_color_new(245, 245, 245),
            bg_1000: palette_color_new(235, 235, 235),
            bg_1100: palette_color_new(225, 225, 225),
            bg_1200: palette_color_new(215, 215, 215),
            bg_1300: palette_color_new(205, 205, 205),

            border_0800: palette_color_new(136 + 16 * 1, 136 + 16 * 1, 136 + 16 * 1),
            border_0900: palette_color_new(136 + 16 * 2, 136 + 16 * 2, 136 + 16 * 2),
            border_1000: palette_color_new(136, 136, 136),
            border_1100: palette_color_new(136 - 16 * 1, 136 - 16 * 1, 136 - 16 * 1),
            border_1200: palette_color_new(136 - 16 * 2, 136 - 16 * 2, 136 - 16 * 2),

            txt_0800: palette_color_new(100, 100, 100),
            txt_0900: palette_color_new(75, 75, 75),
            txt_1000: palette_color_new(50, 50, 50),
            txt_1100: palette_color_new(25, 25, 25),
            txt_1200: palette_color_new(0, 0, 0),
        } as const,

        blue: {
            bg_0800: palette_color_new(118 + 32 * 2, 145 + 20 * 2, 254 - 4 * 2),
            bg_0900: palette_color_new(118 + 32 * 1, 145 + 20 * 1, 254 - 4 * 1),
            bg_1000: palette_color_new(110, 140, 255),
            bg_1100: palette_color_new(91, 121, 255),
            bg_1200: palette_color_new(72, 102, 255),
            bg_1300: palette_color_new(53, 83, 255),

            txt_1000: palette_color_new(255, 255, 255),
        }
    } as const
} as const
