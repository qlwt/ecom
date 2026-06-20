import { gv } from "@fst/gstate"
import * as asr from "@qyu/atom-state-react"
import * as rfl from "@qyu/reactcmp-flow-control"
import st from "@src/client/component/primitive/report/style/view.module.scss"
import { domroot_modal } from "@src/client/const/domroot"
import cl from "classnames"
import * as r from "react"
import * as rdom from "react-dom"

type EL__Line_Props = {
    readonly node: gv.GVReport_State
}

const EL_Line: r.FC<EL__Line_Props> = props => {
    const dispatch = asr.useAtomDispatch()

    return <button
        className={cl(st.line, {
            [st._info!]: props.node.kind === gv.GVReport_Kind.Info,
            [st._error!]: props.node.kind === gv.GVReport_Kind.Error,
        })}

        onClick={() => {
            dispatch(gv.report.act.delete(props.node.id))
        }}
    >
        {props.node.text}
    </button>
}

export type EPReport__View_Props = {

}

export const EPReport_View: r.FC<EPReport__View_Props> = props => {
    const nodes = asr.useAtomOutput(gv.report.state)

    return rdom.createPortal(
        <div className={st.root}>
            <rfl.CmpLoop data={nodes}>
                {node => {
                    return <EL_Line key={node.id} node={node} />
                }}
            </rfl.CmpLoop>
        </div>,
        domroot_modal
    )
}

export default EPReport_View
