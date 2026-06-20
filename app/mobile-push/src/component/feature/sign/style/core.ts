import type { Palette_Theme } from "@/src/util/palette/def"
import * as rn from "react-native"

type Params = {
    readonly theme: Palette_Theme
}

export const efsign__stf_core = ({ theme }: Params) => {
    return rn.StyleSheet.create({
        root: {
            flex: 1,
            alignItems: "stretch",
            justifyContent: "center",

            paddingHorizontal: 50,
            backgroundColor: theme.base.bg_1000.hex,
        },

        form: {
            flex: 0,
            gap: 15,
            color: theme.base.txt_1200.hex,
        },

        head: {
            alignSelf: "center",
            fontSize: 26,
            fontWeight: 500,
        },

        field: {
            flex: 0,
            gap: 5,
        },

        label: {
            flex: 0,
            fontSize: 14,
            color: theme.base.txt_1000.hex,
        },

        input: {
            flex: 0,
            backgroundColor: theme.base.bg_0800.hex,

            borderWidth: 1,
            borderRadius: 4,
            borderStyle: "solid",
            borderColor: theme.base.border_1000.hex,

            paddingVertical: 10,
            paddingHorizontal: 15,

            fontSize: 16,
            color: theme.base.txt_1000.hex,
        },

        acts: {
            flex: 0,
            gap: 15,
            flexDirection: "row",
        },

        act: {
            flexGrow: 1,
            flexShrink: 0,

            alignItems: "center",

            borderRadius: 4,
            paddingVertical: 10,
            paddingHorizontal: 25,
        },

        act_disabled: {
            backgroundColor: theme.blue.bg_0800.hex,
        },

        act_active: {
            backgroundColor: theme.blue.bg_1000.hex,
        },

        act__txt: {
            color: theme.blue.txt_1000.hex,
        }
    })
}
