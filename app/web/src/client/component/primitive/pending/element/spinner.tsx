import st from "@src/client/component/primitive/pending/style/spinner.module.scss"
import * as r from "react"
import cl from "classnames"
import { EPPending_Spinner_Palette } from "@client/component/primitive/pending/type/spinner_palette"
import { EPPending_Spinner_Size } from "@src/client/component/primitive/pending/type/spinner_size"

export { EPPending_Spinner_Size }
export { EPPending_Spinner_Palette }

export type EPPending__Spinner_Props = {
    readonly size?: EPPending_Spinner_Size
    readonly palette?: EPPending_Spinner_Palette
}

export const EPPending_Spinner: r.FC<EPPending__Spinner_Props> = props => {
    const nprop_palette = props.palette ?? EPPending_Spinner_Palette.Blue
    const nprop_size = props.size ?? EPPending_Spinner_Size.Normal

    return <div className={cl(st.spinner, {
        [st.spinner_big!]: nprop_size === EPPending_Spinner_Size.Big,
        [st.spinner_small!]: nprop_size === EPPending_Spinner_Size.Small,
        [st.spinner_normal!]: nprop_size === EPPending_Spinner_Size.Normal,
        [st._palette_blue!]: nprop_palette === EPPending_Spinner_Palette.Blue,
        [st._palette_green!]: nprop_palette === EPPending_Spinner_Palette.Green,
    })} />
}

export default EPPending_Spinner
