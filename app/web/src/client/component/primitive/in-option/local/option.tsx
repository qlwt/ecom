import st from "@client/component/primitive/in-option/style/core.module.scss"
import type { FnSetterStateful, FnSetterStateles } from "@src/client/type/fns"
import cl from "classnames"
import * as r from "react"

export type ELInOption__Option_Props<T> = {
    readonly theme: { readonly [K in string]: string }

    readonly status_selected: boolean
    readonly state_open_set: FnSetterStateful<boolean>

    readonly option_node: T
    readonly option_selection_set: FnSetterStateles<T>

    readonly option_name_new: (option: T) => string
}

type FnDef = {
    <T>(props: ELInOption__Option_Props<T>): r.ReactNode
}

export const ELInOption_Option: FnDef = r.memo(props => {
    const name = props.option_name_new(props.option_node)

    return <button
        disabled={props.status_selected}

        className={cl(st.option, props.theme.option, {
            [st._selected!]: props.status_selected,
            [props.theme._selected!]: props.status_selected,
        })}

        onClick={() => {
            props.state_open_set(false)
            props.option_selection_set(props.option_node)
        }}
    >
        <span className={cl(st.option__text, props.theme.option__text)}>
            {name}
        </span>
    </button>
})

export default ELInOption_Option
