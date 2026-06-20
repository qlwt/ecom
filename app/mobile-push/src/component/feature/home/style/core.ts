import { palette_color_format_rgba } from "@/src/util/palette/color_format_rgba"
import type { Palette_Theme } from "@/src/util/palette/def"
import * as rn from "react-native"

type Params = {
    readonly theme: Palette_Theme
}

export const efhome__stf_core = ({ theme }: Params) => {
    return rn.StyleSheet.create({
        root: {
            flex: 1,
            backgroundColor: theme.base.bg_1000.hex,
        },

        page: {
            flex: 1,
        },

        list: {
            gap: 15,
            paddingVertical: 15,
            paddingHorizontal: 25,
        },

        item: {
            position: "relative",

            flexGrow: 0,
            flexShrink: 0,
            backgroundColor: theme.base.bg_0800.hex,

            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",

            paddingVertical: 5,
            paddingHorizontal: 5,

            borderRadius: 4,
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: theme.base.border_1000.hex,
        },

        item__fog: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,

            zIndex: 1,

            pointerEvents: "none",
            backgroundColor: `rgba(${palette_color_format_rgba(theme.base.bg_1300, 0.7)})`
        },

        item__head: {
            flexGrow: 0,
            flexShrink: 0,

            gap: 8,
            flexDirection: "row",
            alignItems: "center",
        },

        item__icon__view: {
            flexGrow: 0,
            flexShrink: 0,

            alignItems: "center",
            justifyContent: "center",

            width: 40,
            height: 40,
        },

        item__icon__txt: {
            fontSize: 17,
            color: theme.base.txt_1100.hex,
        },

        item__date: {
            flexGrow: 0,
            flexShrink: 0,

            fontSize: 13,
            color: theme.base.txt_0800.hex,
        },

        item__name: {
            flexGrow: 0,
            flexShrink: 0,

            fontSize: 15,
            color: theme.base.txt_1000.hex,
        },

        item__acts: {
            flexGrow: 0,
            flexShrink: 0,

            flexDirection: "row",
            alignItems: "center",
        },

        item__act__view: {
            flexGrow: 0,
            flexShrink: 0,

            alignItems: "center",
            justifyContent: "center",

            width: 40,
            height: 40,
        },

        item__act__view_bell: {
            position: "relative",
        },

        item__act__reddot: {
            position: "absolute",
            top: 7,
            right: 7,

            width: 8,
            height: 8,
            borderRadius: "50%",

            backgroundColor: "red",
        },

        item__act__txt: {
            fontSize: 17,
            color: theme.base.txt_1100.hex,
        },

        item__act__txt_delete: {
            color: "red",
        },
    })
}
