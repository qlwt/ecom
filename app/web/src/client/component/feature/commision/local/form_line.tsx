import st from "@client/component/feature/commision/style/form_line.module.scss"
import cl from "classnames"
import * as r from "react"

export type ELCommision__FormField_Props = {
    readonly title: string

    readonly style_flexgrow?: boolean

    readonly children?: r.ReactNode
}

export const ELCommision_FormField: r.FC<ELCommision__FormField_Props> = props => {
    return <div
        className={cl(
            st.container,
            {
                [st._st_flexgrow!]: props.style_flexgrow === true,
            }
        )}
    >
        <span className={st.title}>
            {props.title}
        </span>

        {props.children}
    </div>
}

export default ELCommision_FormField
