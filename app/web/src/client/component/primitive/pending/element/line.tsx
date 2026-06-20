import st from "@src/client/component/primitive/pending/style/line.module.scss"
import * as r from "react"

export type EPPending__Line_Props = {
}

export const EPPending_Line: r.FC<EPPending__Line_Props> = props => {
    return <div className={st.card_pending__line} >
        <div className={st.card_pending__line__bar} />
    </div>
}

export default EPPending_Line
