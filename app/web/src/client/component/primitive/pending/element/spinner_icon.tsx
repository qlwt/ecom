import st from "@src/client/component/primitive/pending/style/spinner.module.scss"
import * as r from "react"
import cl from "classnames"
import { EPPending_Spinner_Palette } from "@src/client/component/primitive/pending/type/spinner_palette"

export type EPPending__SpinnerIcon_Props = {
    readonly palette?: EPPending_Spinner_Palette
}

export const EPPending_SpinnerIcon: r.FC<EPPending__SpinnerIcon_Props> = props => {
    const nprop_palette = props.palette ?? EPPending_Spinner_Palette.Blue

    return <div className={cl(st.spinner_icon, {
        [st._palette_blue!]: nprop_palette === EPPending_Spinner_Palette.Blue,
        [st._palette_green!]: nprop_palette === EPPending_Spinner_Palette.Green,
    })} />
}

export default EPPending_SpinnerIcon
