import { EPInText_Context } from "@src/client/component/primitive/in-text/element/context"
import st from "@src/client/component/primitive/in-text/style/core.module.scss"
import cl from "classnames"
import * as r from "react"

export type EPInText__BlockComment_Props = {
    readonly children: string
    readonly className?: string
}

export const EPInText_BlockComment: r.FC<EPInText__BlockComment_Props> = props => {
    const state = r.useContext(EPInText_Context)

    if (!state) { throw new Error(`Using element outside of EPInText_Context`) }

    return <div
        className={cl(st.intext__block_comment, state.stmod?.block_comment)}

        onClick={ev => {
            const el = state.ref_input.current

            if (el && ev.target !== el) {
                el.focus()
                el.setSelectionRange(el.value.length, el.value.length)
            }
        }}
    >
        {props.children}
    </div>
}
