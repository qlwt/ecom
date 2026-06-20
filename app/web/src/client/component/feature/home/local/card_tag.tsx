import * as gs from "@fst/gstate"
import st from "@src/client/component/feature/home/style/card_tag.module.scss"
import type { FnSetterStateful } from "@src/client/type/fns"
import { lang_prop } from "@src/client/util/tl/prop"
import cl from "classnames"
import * as r from "react"
import * as ri18 from "react-i18next"

export type ELHome_CardTag_Props = {
    readonly node: gs.Rem_JoinData<"item_tag">

    readonly state_selected: boolean
    readonly state_selected_set: FnSetterStateful<string | null>
}

export const ELHome_CardTag: r.FC<ELHome_CardTag_Props> = props => {
    const { i18n } = ri18.useTranslation()

    return <button
        className={cl(st.root, props.state_selected && st._selected)}

        onClick={() => {
            props.state_selected_set(old_id => {
                if (props.node.id === old_id) {
                    return null
                }

                return props.node.id
            })
        }}
    >
        {lang_prop(props.node, i18n.language, "name")}
    </button>
}

export default ELHome_CardTag
