import * as fac from "@fortawesome/fontawesome-svg-core"
import EPIcon_FA from "@src/client/component/primitive/icon/element/view"
import { EPInText_Context } from "@src/client/component/primitive/in-text/element/context"
import st from "@src/client/component/primitive/in-text/style/core.module.scss"
import type { Icon_Shortcut } from "@src/client/util/icon/type/shortcut"
import cl from "classnames"
import * as r from "react"

export type EPInText__IconView_Props = {
    readonly className?: string

    readonly icon: fac.IconDefinition | Icon_Shortcut
}

export const EPInText_IconView: r.FC<EPInText__IconView_Props> = props => {
    const state = r.useContext(EPInText_Context)

    if (!state) { throw new Error(`Using element outside of EPInText_Context`) }

    return <div
        className={cl(st.intext__icon, state.stmod?.icon, props.className)}

        onClick={ev => {
            const el = state.ref_input.current

            if (el && ev.target !== el) {
                el.focus()
                el.setSelectionRange(el.value.length, el.value.length)
            }
        }}
    >
        <EPIcon_FA def={props.icon} />
    </div>
}
