import * as dbdef from "@fst/db-default"
import * as gs from "@fst/gstate"
import { rem } from "@fst/gstate"
import * as asr from "@qyu/atom-state-react"
import st from "@src/client/component/primitive/product/style/argview_bool.module.scss"
import { lang_prop } from "@src/client/util/tl/prop"
import cl from "classnames"
import * as r from "react"
import { v7 as uuid } from "uuid"

export type ELProduct__ArgViewBool_Props = {
    readonly product_id: string
    readonly product_owner: string | null

    readonly lang: string | null
    readonly lang_fallback: string | undefined
    readonly arg_bool: gs.Rem_JoinData<"tmplpr_arg_bool">
    readonly imp_bool: gs.Rem_JoinData<"product_argbool"> | null

    readonly hook_action: (() => boolean) | null
}

export const ELProduct_ArgViewBool: r.FC<ELProduct__ArgViewBool_Props> = props => {
    const dispatch = asr.useAtomDispatch()
    const imp_id = r.useMemo(() => props.imp_bool?.id ?? uuid(), [props.imp_bool?.id])

    const value = props.imp_bool?.value ?? props.arg_bool.value_def

    const update_value = (value: 0 | 1) => {
        if (props.hook_action?.() !== false) {
            dispatch(rem.product_argbool.act.upsert({
                patch: {
                    body: {
                        id: imp_id,

                        patch: {
                            value,
                        },
                    },
                },

                post_new: () => ({
                    body: [{
                        core: {
                            ...dbdef.table.product_argbool,

                            id: imp_id,
                            value,
                            owner: props.product_owner,
                            product__id: props.product_id,
                            tmplpr_arg_bool__id: props.arg_bool.id,
                        },

                        joins: {},
                    }]
                }),
            }))
        }
    }

    return <div className={st.root}>
        <button
            disabled={value === 0}
            className={cl(st.btn, value === 0 && st._active)}

            onClick={() => {
                update_value(0)
            }}
        >
            {lang_prop(props.arg_bool, props.lang, "title_false", props.lang_fallback)}
        </button>

        <button
            disabled={value === 1}
            className={cl(st.btn, value === 1 && st._active)}

            onClick={() => {
                update_value(1)
            }}
        >
            {lang_prop(props.arg_bool, props.lang, "title_true", props.lang_fallback)}
        </button>
    </div>
}
