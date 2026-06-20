import * as rfl from "@qyu/reactcmp-flow-control"
import { ELConEdit_MarkState } from "@src/client/component/feature/console-edit/local/mark_state"
import st from "@src/client/component/feature/console-edit/style/mark.module.scss"
import EPAction_BtnClick from "@src/client/component/primitive/action/element/btn_click"
import cl from "classnames"
import * as r from "react"

export type ELConEdit__Mark_Props = {
    readonly id: string
    readonly label: string
    readonly delete: (id: string) => void

    readonly children?: r.ReactNode
}

export const ELConEdit_Mark: r.FC<ELConEdit__Mark_Props> = props => {
    const [open, open_set] = r.useState(false)

    const ref_view = r.useRef<HTMLDivElement | null>(null)

    return <ELConEdit_MarkState value={{ open, open_set }}>
        <rfl.CmpIf value={open}>
            {() => <div
                ref={ref_view}
                className={cl(st.view)}

                onBlur={ev => {
                    const view = ref_view.current

                    if (view) {
                        if (!(ev.nativeEvent.relatedTarget instanceof HTMLElement) || !view.contains(ev.nativeEvent.relatedTarget)) {
                            open_set(false)
                        }
                    }
                }}
            >
                {props.children}

                <EPAction_BtnClick
                    style_redclr

                    icon={`trashcan`}
                    className={cl(st.view__item)}
                    event_click={() => { props.delete(props.id) }}
                />
            </div>}
        </rfl.CmpIf>

        <rfl.CmpIf value={!open}>
            {() => <button
                className={cl(st.button)}

                onClick={() => {
                    open_set(true)
                }}
            >
                <span className={cl(st.button__text)}>
                    {props.label}
                </span>
            </button>}
        </rfl.CmpIf>
    </ELConEdit_MarkState>
}
