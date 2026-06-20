import type { Icon_Shortcut } from "@src/client/util/icon/type/shortcut"
import * as r from "react"
import * as fac from "@fortawesome/fontawesome-svg-core"
import * as faw from "@fortawesome/react-fontawesome"
import { icon_new } from "@src/client/util/icon/new"

export type EPIcon__FA_Props = {
    readonly def: Icon_Shortcut | fac.IconDefinition

    readonly className?: string
}

export const EPIcon_FA: r.FC<EPIcon__FA_Props> = props => {
    return <faw.FontAwesomeIcon className={props.className} icon={icon_new(props.def)} />
}

export default EPIcon_FA
