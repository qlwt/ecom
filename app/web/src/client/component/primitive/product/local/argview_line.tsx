import * as dbdef from "@fst/db-default"
import * as gs from "@fst/gstate"
import { rem } from "@fst/gstate"
import * as asr from "@qyu/atom-state-react"
import EPInSlider_ViewLine from "@src/client/component/primitive/in-slider/element/view_line"
import st from "@src/client/component/primitive/product/style/argview_int.module.scss"
import * as r from "react"
import { v7 as uuid } from "uuid"

export type ELProduct__ArgViewLine_Props = {
    readonly product_id: string
    readonly product_owner: string | null

    readonly lang: string | null
    readonly lang_fallback: string | undefined
    readonly arg_line: gs.Rem_JoinData<"tmplpr_arg_line">
    readonly imp_line: gs.Rem_JoinData<"product_argline"> | null

    readonly hook_action: (() => boolean) | null
}

export const ELProduct_ArgViewLine: r.FC<ELProduct__ArgViewLine_Props> = props => {
    const dispatch = asr.useAtomDispatch()
    const imp_id = r.useMemo(() => props.imp_line?.id ?? uuid(), [props.imp_line?.id])

    const value = props.imp_line?.x_value ?? props.arg_line.x_value_def

    return <div className={st.root}>
        <EPInSlider_ViewLine
            value={value}
            value_step={props.arg_line.x_value_step}

            lang={props.lang}
            lang_fallback={props.lang_fallback}

            value_set={now_value => {
                if (props.hook_action?.() !== false) {
                    dispatch(rem.product_argline.act.upsert({
                        patch: {
                            body: {
                                id: imp_id,

                                patch: {
                                    x_value: now_value,
                                }
                            },
                        },

                        post_new: () => ({
                            body: [{
                                core: {
                                    ...dbdef.table.product_argline,

                                    id: imp_id,
                                    x_value: now_value,
                                    owner: props.product_owner,
                                    product__id: props.product_id,
                                    tmplpr_arg_line__id: props.arg_line.id,
                                },

                                joins: {},
                            }]
                        }),
                    }))
                }
            }}

            mark_style_shownum={false}
            mark_act={{ kind: "click" }}
            mark_list={props.arg_line.marks}

            bound_act={{ kind: "click" }}

            bound_min={{
                value_real: props.arg_line.x_bound_min,
                value_view: props.arg_line.x_bound_min,
            }}

            bound_max={{
                value_real: props.arg_line.x_bound_max,
                value_view: props.arg_line.x_bound_max,
            }}
        />
    </div>
}
