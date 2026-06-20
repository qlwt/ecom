import st from "@client/component/primitive/in-option/style/core.module.scss"
import type { FnSetterStateful } from "@src/client/type/fns"
import cl from "classnames"
import * as r from "react"
import * as rfl from "@qyu/reactcmp-flow-control"
import EPIcon_FA from "@src/client/component/primitive/icon/element/view"

type EL__SearchInput_Props = {
    readonly ref_search: r.RefObject<HTMLInputElement | null>

    readonly refo_content: () => HTMLDivElement | null

    readonly placeholder: string
    readonly status_disabled: boolean
    readonly mask: string | undefined
    readonly theme: { readonly [K in string]: string }

    readonly state_search: string
    readonly state_search_set: FnSetterStateful<string>

    readonly state_open: boolean
    readonly state_open_set: FnSetterStateful<boolean>
}

const EL_SearchInput: r.FC<EL__SearchInput_Props> = r.memo(props => {
    const modifiers = cl({
        [st._open!]: props.state_open,
        [st._disabled!]: props.status_disabled,
        [props.theme._open!]: props.state_open,
        [props.theme._disabled!]: props.status_disabled,
    })

    const mask = r.useMemo(() => {
        let result: string

        if (props.mask !== undefined) {
            result = props.mask
        } else {
            result = props.state_search || props.placeholder || " "
        }

        return result.replace(/\s/g, "\u00A0")
    }, [props.mask, props.state_search, props.placeholder])

    return <div
        className={cl(st.search__container, props.theme.search__container, modifiers)}
    >
        <input
            ref={props.ref_search}

            type={`text`}
            placeholder={props.placeholder}
            tabIndex={(props.state_open && !props.status_disabled) ? 0 : -1}
            className={cl(st.search__input, props.theme.search__input, modifiers)}

            value={props.state_search}

            onChange={ev => {
                props.state_search_set(ev.target.value)
            }}

            onKeyDown={ev => {
                if (ev.key.toLowerCase() === "tab" && ev.shiftKey === false) {
                    const content = props.refo_content()

                    if (content) {
                        content.focus()

                        ev.preventDefault()
                    }
                }
            }}
        />

        <div
            aria-hidden={true}
            className={cl(st.search__mask, props.theme.search__mask, modifiers)}
        >
            {mask}
        </div>
    </div>
})

type EL__HeadName_Props = {
    readonly placeholder: string
    readonly status_disabled: boolean
    readonly mask: string | undefined
    readonly theme: { readonly [K in string]: string }

    readonly state_search: string

    readonly state_open: boolean
}

const EL_HeadName: r.FC<EL__HeadName_Props> = r.memo(props => {
    const modifiers = cl({
        [st._open!]: props.state_open,
        [st._disabled!]: props.status_disabled,
        [props.theme._open!]: props.state_open,
        [props.theme._disabled!]: props.status_disabled,
    })

    const mask = r.useMemo(() => {
        let result: string

        if (props.mask !== undefined) {
            result = props.mask
        } else {
            result = props.state_search || props.placeholder || " "
        }

        return result.replace(/\s/g, "\u00A0")
    }, [props.mask, props.state_search, props.placeholder])

    return <div className={cl(st.search__container, props.theme.search__container, modifiers)}>
        <div className={cl(st.head__name, props.theme.head__name, modifiers)}>
            {props.state_search || props.placeholder}
        </div>

        <div
            aria-hidden={true}
            className={cl(st.search__mask, props.theme.search__mask, modifiers)}
        >
            {mask}
        </div>
    </div>
})

export type EPInOption__Head_Props = {
    readonly ref_search: r.RefObject<HTMLInputElement | null>
    readonly ref_container: r.RefObject<HTMLButtonElement | null>

    readonly refo_content: () => HTMLDivElement | null

    readonly placeholder: string
    readonly kind_search: boolean
    readonly mask: string | undefined
    readonly theme: { readonly [K in string]: string }

    readonly state_search: string
    readonly state_search_set: FnSetterStateful<string>

    readonly state_open: boolean
    readonly state_open_set: FnSetterStateful<boolean>

    readonly status_empty: boolean
    readonly status_disabled: boolean
}

export const EPInOption_Head: r.FC<EPInOption__Head_Props> = r.memo(props => {
    return <button
        ref={props.ref_container}

        role={`button`}
        aria-disabled={props.status_disabled}
        disabled={props.status_disabled}
        tabIndex={!(props.status_disabled || props.state_open) ? 0 : -1}

        className={cl(st.head, props.theme?.head, {
            [props.theme._open!]: props.state_open,
            [props.theme._disabled!]: props.status_disabled,

            [st._open!]: props.state_open,
            [st._disabled!]: props.status_disabled,
        })}

        onClick={() => {
            props.state_open_set(true)
        }}
    >
        <rfl.CmpIf value={props.kind_search}>
            {() => {
                return <EL_SearchInput
                    ref_search={props.ref_search}
                    refo_content={props.refo_content}

                    mask={props.mask}
                    theme={props.theme}
                    placeholder={props.placeholder}

                    state_search={props.state_search}
                    state_search_set={props.state_search_set}

                    state_open={props.state_open}
                    state_open_set={props.state_open_set}

                    status_disabled={props.status_disabled}
                />
            }}
        </rfl.CmpIf>

        <rfl.CmpIf value={!props.kind_search}>
            {() => {
                return <EL_HeadName 
                    mask={props.mask}
                    theme={props.theme}
                    placeholder={props.placeholder}

                    state_search={props.state_search}

                    state_open={props.state_open}

                    status_disabled={props.status_disabled}
                />
            }}
        </rfl.CmpIf>

        <div className={cl(st.head__icon, props.theme.head__icon)}>
            <EPIcon_FA def={`caret-bottom`} />
        </div>
    </button>
})

export default EPInOption_Head
