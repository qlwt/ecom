import * as gs from "@fst/gstate"
import type { FnSetterStateles } from "@qyu/reactcmp-dropdown"
import st from "@src/client/component/primitive/product/style/argbtn.module.scss"
import { lang_prop } from "@src/client/util/tl/prop"
import cl from "classnames"
import * as r from "react"

export type ELProduct__ArgBtnLine_Props = {
    readonly lang: string | null
    readonly lang_fallback: string | undefined

    readonly state_active: boolean
    readonly state_active_set: FnSetterStateles<string>

    readonly arg: gs.Rem_JoinData<"tmplpr_arg">
    readonly arg_line: gs.Rem_JoinData<"tmplpr_arg_line">
    readonly imp_line: gs.Rem_JoinData<"product_argline"> | null
}

export const ELProduct_ArgBtnLine: r.FC<ELProduct__ArgBtnLine_Props> = props => {
    const x_value = props.imp_line?.x_value ?? props.arg_line.x_value_def

    return <button
        disabled={props.state_active}
        className={cl(st.root, props.state_active && st._active)}

        onClick={() => {
            props.state_active_set(props.arg.id)
        }}
    >
        {lang_prop(props.arg, props.lang, "name", props.lang_fallback)}:

        <span className={st.merged}>
            <span className={st.merged__item}>
                {x_value}
            </span>

            <span className={cl(st.merged__item, st._hidden)}>
                {props.arg_line.x_bound_max}
            </span>
        </span>
    </button>
}

export default ELProduct_ArgBtnLine
