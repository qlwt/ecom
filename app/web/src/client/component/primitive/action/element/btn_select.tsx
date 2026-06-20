import st from "@client/component/primitive/action/style/core.module.scss"
import * as ddn from "@qyu/reactcmp-dropdown"
import * as rfl from "@qyu/reactcmp-flow-control"
import EPAction_BtnCheck from "@src/client/component/primitive/action/element/btn_check"
import EPAction_View from "@src/client/component/primitive/action/element/view"
import { domroot_dropdown } from "@src/client/const/domroot"
import { useRefO } from "@src/client/hook/ref/o"
import cl from "classnames"
import * as r from "react"

export type EPAction__BtnSelect_Option = {
    readonly id: string
    readonly children: r.ReactNode

    readonly style_redclr?: boolean
}

export type EPAction__BtnSelect_Props = {
    readonly value: string | null
    readonly event_change: (value: string | null) => void

    readonly option_fallback: r.ReactNode
    readonly option_list: readonly EPAction__BtnSelect_Option[]

    readonly style_root?: boolean
    readonly style_redclr?: boolean
    readonly style_nofallback?: boolean
    readonly style_shadow_type?: "normal" | "none"

    readonly className?: string
}

export const EPAction_BtnSelect: r.FC<EPAction__BtnSelect_Props> = props => {
    const ref_btn = r.useRef<HTMLButtonElement | null>(null)
    const oref_btn = useRefO(ref_btn)

    const nprop_style_nofallback = props.style_nofallback ?? false
    const nprop_style_shadow_type = props.style_shadow_type ?? "normal"

    const [open, open_set] = r.useState(false)

    const option_active = r.useMemo(() => {
        if (props.value === null) {
            return null
        }

        return props.option_list.find(option => option.id === props.value) ?? null
    }, [props.option_list, props.value])

    return <ddn.CmpContainerVirtual open={open} open_set={open_set}>
        <ddn.CmpButtonVirtual target={oref_btn}>
            <button
                ref={ref_btn}

                onClick={() => {
                    open_set(o => !o)
                }}

                className={cl(st.btn, st.btn_select, props.className, {
                    [st._active!]: open,
                    [st.root!]: props.style_root,
                    [st._style_redclr!]: props.style_redclr,
                    [st._shadow_type_normal!]: nprop_style_shadow_type === "normal",
                }, props.className)}
            >
                <div className={st.merge}>
                    <div className={st.merge__item}>
                        {option_active ? option_active.children : props.option_fallback}
                    </div>

                    <div className={cl(st.merge__item, st._hidden)}>
                        {props.option_fallback}
                    </div>

                    <rfl.CmpLoop data={props.option_list}>
                        {option => {
                            return <div key={option.id} className={cl(st.merge__item, st._hidden)}>
                                {option.children}
                            </div>
                        }}
                    </rfl.CmpLoop>
                </div>
            </button>
        </ddn.CmpButtonVirtual>

        <ddn.CmpListPortal portal={domroot_dropdown} gap={3} align={`center`} stretch>
            {() => {
                return <ddn.CmpContent>
                    <EPAction_View style_root style_direction={`column`}>
                        <rfl.CmpLoop data={props.option_list} reverse>
                            {option => {
                                return <EPAction_BtnCheck
                                    key={option.id}

                                    style_redclr={option.style_redclr}

                                    state_active={props.value === option.id}

                                    event_click={() => {
                                        props.event_change(option.id)
                                    }}
                                >
                                    {option.children}
                                </EPAction_BtnCheck>
                            }}
                        </rfl.CmpLoop>

                        <rfl.CmpIf value={!nprop_style_nofallback}>
                            {() => <EPAction_BtnCheck
                                style_redclr={props.style_redclr}

                                state_active={props.value === null}

                                event_click={() => {
                                    props.event_change(null)
                                }}
                            >
                                {props.option_fallback}
                            </EPAction_BtnCheck>}
                        </rfl.CmpIf>
                    </EPAction_View>
                </ddn.CmpContent>
            }}
        </ddn.CmpListPortal>
    </ddn.CmpContainerVirtual>
}

export default EPAction_BtnSelect
