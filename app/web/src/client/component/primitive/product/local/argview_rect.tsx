import * as dbdef from "@fst/db-default"
import * as gs from "@fst/gstate"
import { rem } from "@fst/gstate"
import * as asr from "@qyu/atom-state-react"
import EPInSlider_ViewSq from "@src/client/component/primitive/in-slider/element/view_square"
import st from "@src/client/component/primitive/product/style/argview_rect.module.scss"
import cl from "classnames"
import * as r from "react"
import { v7 as uuid } from "uuid"

export type ELProduct__ArgViewRect_Props = {
    readonly lang: string | null
    readonly lang_fallback: string | undefined

    readonly product_id: string
    readonly product_owner: string | null

    readonly arg_rect: gs.Rem_JoinData<"tmplpr_arg_rect">
    readonly imp_rect: gs.Rem_JoinData<"product_argrect"> | null

    readonly hook_action: (() => boolean) | null
}

export const ELProduct_ArgViewRect: r.FC<ELProduct__ArgViewRect_Props> = props => {
    const dispatch = asr.useAtomDispatch()
    const imp_id = r.useMemo(() => props.imp_rect?.id ?? uuid(), [props.imp_rect?.id])

    return <div className={cl(st.root)}>
        <EPInSlider_ViewSq
            lang={props.lang}
            lang_fallback={props.lang_fallback}

            mark_style_shownum={false}
            mark_act={{ kind: "click" }}
            mark_list={props.arg_rect.marks}

            x_bound_act={{ kind: "click" }}
            y_bound_act={{ kind: "click" }}

            x_bound_min={{
                value_view: 0,
                value_real: props.arg_rect.x_bound_min,
            }}

            x_bound_max={{
                value_real: props.arg_rect.x_bound_max,
                value_view: props.arg_rect.x_bound_max,
            }}

            y_bound_min={{
                value_view: 0,
                value_real: props.arg_rect.y_bound_min,
            }}

            y_bound_max={{
                value_real: props.arg_rect.y_bound_max,
                value_view: props.arg_rect.y_bound_max,
            }}

            x_value_step={props.arg_rect.x_value_step}
            x_value={props.imp_rect?.x_value ?? props.arg_rect.x_value_def}
            y_value_step={props.arg_rect.y_value_step}
            y_value={props.imp_rect?.y_value ?? props.arg_rect.y_value_def}

            x_value_set={x_value => {
                if (props.hook_action?.() !== false) {
                    dispatch(rem.product_argrect.act.upsert({
                        patch: {
                            body: {
                                id: imp_id,

                                patch: {
                                    x_value,
                                },
                            },
                        },

                        post_new: () => ({
                            body: [{
                                core: {
                                    ...dbdef.table.product_argrect,

                                    id: imp_id,

                                    x_value,
                                    y_value: props.arg_rect.y_value_def,

                                    owner: props.product_owner,
                                    product__id: props.product_id,
                                    tmplpr_arg_rect__id: props.arg_rect.id,
                                },

                                joins: {},
                            }],
                        }),
                    }))
                }
            }}

            y_value_set={y_value => {
                if (props.hook_action?.() !== false) {
                    dispatch(rem.product_argrect.act.upsert({
                        patch: {
                            body: {
                                id: imp_id,

                                patch: {
                                    y_value,
                                },
                            },
                        },

                        post_new: () => ({
                            body: [{
                                core: {
                                    ...dbdef.table.product_argrect,

                                    id: imp_id,

                                    y_value,
                                    x_value: props.arg_rect.x_value_def,

                                    owner: props.product_owner,
                                    product__id: props.product_id,
                                    tmplpr_arg_rect__id: props.arg_rect.id,
                                },

                                joins: {},
                            }],
                        }),
                    }))
                }
            }}
        />
    </div>
}
