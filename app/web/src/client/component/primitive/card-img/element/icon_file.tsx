import st from "@client/component/primitive/card-img/style/core.module.scss"
import * as fac from "@fortawesome/fontawesome-svg-core"
import * as faw from "@fortawesome/react-fontawesome"
import { icon_new } from "@src/client/util/icon/new"
import type { Icon_Shortcut } from "@src/client/util/icon/type/shortcut"
import cl from "classnames"
import * as r from "react"

export type EPCardImg__IconFile_Props = {
    readonly state_error?: boolean

    readonly icon: fac.IconDefinition | Icon_Shortcut

    readonly accept: string
    readonly multiple: boolean
    readonly event_upload: (files: File[]) => void

    readonly className?: string
    readonly className_drag?: string
}

export const EPCardImg_IconFile: r.FC<EPCardImg__IconFile_Props> = props => {
    const [drag, drag_set] = r.useState(false)
    const ref_filepick = r.useRef<HTMLInputElement | null>(null)

    const icon = icon_new(props.icon)

    return <button
        draggable={true}
        className={cl(
            st.icon,
            st.icon_file,
            drag && props.className_drag,
            props.state_error && st._error,
            props.className,
        )}

        onClick={() => {
            ref_filepick.current?.click()
        }}

        onDragOver={ev => {
            ev.preventDefault()

            drag_set(true)
        }}

        onDragLeave={ev => {
            ev.preventDefault()

            drag_set(false)
        }}

        onDrop={ev => {
            ev.preventDefault()

            drag_set(false)

            props.event_upload([...ev.dataTransfer.files])
        }}
    >
        <faw.FontAwesomeIcon icon={icon} />

        <input
            ref={ref_filepick}

            type="file"
            accept={props.accept}
            className={st.hidden}
            multiple={props.multiple}

            onInput={event => {
                props.event_upload([...event.currentTarget.files || []])
            }}
        />
    </button>
}

export default EPCardImg_IconFile
