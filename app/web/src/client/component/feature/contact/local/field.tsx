import * as r from "react"
import cl from "classnames"
import st from "@src/client/component/feature/contact/style/field.module.scss"

export type ELContact__Field_Props = {
    readonly title: string
    readonly target_id?: string
    readonly className?: string
    readonly children?: r.ReactNode
}

export const ELContact_Field: r.FC<ELContact__Field_Props> = props => {
    return <div className={cl(st.field, props.className)}>
        <label className={st.label} htmlFor={props.target_id}>
            {props.title}
        </label>

        {props.children}
    </div>
}

export default ELContact_Field
