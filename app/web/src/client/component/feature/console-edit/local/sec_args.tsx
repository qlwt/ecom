import * as cc from "@fst/config/client"
import * as cst from "@fst/cst"
import * as dbdef from "@fst/db-default"
import { rem } from "@fst/gstate"
import * as asr from "@qyu/atom-state-react"
import * as rfl from "@qyu/reactcmp-flow-control"
import ELConEdit_TmplPrArg from "@src/client/component/feature/console-edit/local/tmplpr_arg"
import st from "@src/client/component/feature/console-edit/style/sec_tmplpr_args.module.scss"
import EPCardImg_IconView from "@src/client/component/primitive/card-img/element/icon_view"
import EPCardImg_LayerFButton from "@src/client/component/primitive/card-img/element/layerf_button"
import EPCardImg_LayoutMainCol from "@src/client/component/primitive/card-img/element/layout_maincol"
import EPCardImg_View from "@src/client/component/primitive/card-img/element/view"
import * as r from "react"
import { v7 as uuid } from "uuid"

export type ELConEdit__SecArgs_Props = {
    readonly tmplpr_id: string
    readonly args: readonly cc.RemDef["tmplpr_arg"]["joins"]["core"][]
}

export const ELConEdit_SecArgs: r.FC<ELConEdit__SecArgs_Props> = props => {
    const dispatch = asr.useAtomDispatch()

    return <section className={st.root}>
        <EPCardImg_View className={st.node}>
            <EPCardImg_LayerFButton
                event_click={() => {
                    const arg_id = uuid()

                    dispatch(rem.tmplpr_arg.act.post({
                        body: [{
                            core: {
                                ...dbdef.table.tmplpr_arg,

                                id: arg_id,
                                tmplpr__id: props.tmplpr_id,
                                kind: cst.TmplPrArg_Kind.Line,
                            },

                            joins: {
                                defs_line: [{
                                    core: {
                                        ...dbdef.table.tmplpr_arg_line,

                                        id: uuid(),
                                        tmplpr_arg__id: arg_id,
                                    },

                                    joins: {},
                                }]
                            },
                        }],
                    }))
                }}
            >
                <EPCardImg_LayoutMainCol className={st.node__content}>
                    <EPCardImg_IconView icon={`post`} />
                </EPCardImg_LayoutMainCol>
            </EPCardImg_LayerFButton>
        </EPCardImg_View>

        <rfl.CmpLoop data={props.args} reverse>
            {arg => {
                return <ELConEdit_TmplPrArg
                    key={arg.id}

                    node={arg}
                />
            }}
        </rfl.CmpLoop>
    </section>
}

export default ELConEdit_SecArgs
