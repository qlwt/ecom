import * as r from "react"
import st from "@client/component/feature/pingme/style/index.module.scss"
import cl from "classnames"

export type ELPingMe__Btn_Props = {
    readonly order: number
    readonly status_open: boolean
    readonly status_selected: boolean
    readonly event_click: VoidFunction | null

    readonly className?: string
    readonly children?: r.ReactNode
    readonly content_className?: string
}

export const ELPingMe_Btn: r.FC<ELPingMe__Btn_Props> = props => {
    return <div
        className={cl(st.btn__root, props.status_selected && st._selected, props.className)}

        style={{
            ["--order"]: props.order,
        } satisfies r.CSSProperties & { [K in `--${string}`]: any } as r.CSSProperties}
    >
        <button
            className={cl(st.btn__content, props.content_className)}

            disabled={
                (props.status_selected && props.status_open)
                || (props.status_selected && !props.status_selected)
            }

            onClick={() => {
                props.event_click?.()
            }}
        >
            {props.children}
        </button>
    </div>
}

export default ELPingMe_Btn
