import type { Palette_Theme } from "@/src/util/palette/def"
import * as rn from "react-native"

type Params = {
    readonly theme: Palette_Theme
}

export const efheader__st_core = ({ theme }: Params) => {
    return rn.StyleSheet.create({
        root: {
            flex: 0,

            paddingVertical: 15,
            paddingHorizontal: 25,

            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",

            backgroundColor: theme.base.bg_0800.hex,
            boxShadow: `0 0 5 0 ${theme.base.bg_1300}`,
        },

        btn: {
            flex: 0,
            padding: 5,
        },

        btn__txt: {
            fontSize: 20,
            color: theme.base.txt_1000.hex,
        },
    })
}
