import st from "@src/client/component/feature/console-edit/style/mark.module.scss"
import * as r from "react"

export type ELConEdit__MarkList_Props = {
    readonly className?: string
    readonly children?: r.ReactNode
}

export const ELConEdit_MarkList: r.FC<ELConEdit__MarkList_Props> = props => {
    return <div className={st.list}>
        {props.children}
    </div>
}
