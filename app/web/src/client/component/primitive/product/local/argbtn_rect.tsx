import * as gs from "@fst/gstate"
import type { FnSetterStateles } from "@qyu/reactcmp-dropdown"
import st from "@src/client/component/primitive/product/style/argbtn.module.scss"
import { lang_prop } from "@src/client/util/tl/prop"
import cl from "classnames"
import * as r from "react"

export type ELProduct__ArgBtnRect_Props = {
    readonly lang: string | null
    readonly lang_fallback: string | undefined

    readonly state_active: boolean
    readonly state_active_set: FnSetterStateles<string>

    readonly arg: gs.Rem_JoinData<"tmplpr_arg">
    readonly arg_rect: gs.Rem_JoinData<"tmplpr_arg_rect">
    readonly imp_rect: gs.Rem_JoinData<"product_argrect"> | null
}

export const ELProduct_ArgBtnRect: r.FC<ELProduct__ArgBtnRect_Props> = props => {
    const x_value = props.imp_rect?.x_value ?? props.arg_rect.x_value_def
    const y_value = props.imp_rect?.y_value ?? props.arg_rect.y_value_def

    return <button
        disabled={props.state_active}
        className={cl(st.root, props.state_active && st._active)}

        onClick={() => {
            props.state_active_set(props.arg.id)
        }}
    >
        <span>
            {lang_prop(props.arg, props.lang, "name", props.lang_fallback)}:
        </span>

        <span className={st.merged}>
            <span className={st.merged__item}>
                {x_value}x{y_value}
            </span>

            <span className={cl(st.merged__item, st._hidden)}>
                {props.arg_rect.x_bound_max}x{props.arg_rect.y_bound_max}
            </span>
        </span>
    </button>
}

export default ELProduct_ArgBtnRect
