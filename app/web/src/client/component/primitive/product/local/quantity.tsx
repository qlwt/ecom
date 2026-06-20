import * as fas_trash from "@fortawesome/free-solid-svg-icons/faTrashCan"
import * as faw from "@fortawesome/react-fontawesome"
import { rem } from "@fst/gstate"
import * as asr from "@qyu/atom-state-react"
import st from "@src/client/component/primitive/product/style/quantity.module.scss"
import cl from "classnames"
import * as r from "react"

const quantity_normalize = function(num: number): number {
    if (Number.isNaN(num)) {
        return 0
    }

    if (num > 999) {
        return 999
    }

    return num
}

export type ELProduct__Quantity_Props = {
    readonly product_id: string
    readonly product_quantity: number

    readonly hook_action: (() => boolean) | null
}

export const ELProduct_Quantity: r.FC<ELProduct__Quantity_Props> = props => {
    const dispatch = asr.useAtomDispatch()
    const [amount, amount_set] = r.useState(`${props.product_quantity}`)

    r.useEffect(() => {
        amount_set(old_amount => {
            if (props.product_quantity !== quantity_normalize(Number.parseInt(old_amount))) {
                return `${props.product_quantity}`
            }

            return old_amount
        })
    }, [props.product_quantity])

    const quantity_up = function() {
        if (props.hook_action?.() !== false) {
            let action: null | VoidFunction = null as (null | VoidFunction)

            amount_set(old_amount_value => {
                const old_num = quantity_normalize(Number.parseInt(old_amount_value))
                const now_num = Math.min(999, old_num + 1)

                if (old_num !== now_num) {
                    action = () => {
                        dispatch(rem.product.act.patch({
                            body: {
                                id: props.product_id,

                                patch: {
                                    quantity: now_num,
                                },
                            },
                        }))
                    }

                    return `${now_num}`
                }

                return old_amount_value
            })

            if (action) {
                action()
            }
        }
    }

    const quantity_down = function() {
        if (props.hook_action?.() !== false) {
            let action: null | VoidFunction = null as (null | VoidFunction)

            amount_set(old_amount_value => {
                const old_num = quantity_normalize(Number.parseInt(old_amount_value))
                const now_num = Math.max(0, old_num - 1)

                if (old_num !== now_num) {
                    action = () => {
                        dispatch(rem.product.act.patch({
                            body: {
                                id: props.product_id,

                                patch: {
                                    quantity: now_num,
                                },
                            },
                        }))
                    }

                    return `${now_num}`
                }

                return old_amount_value
            })

            {
                action?.()
            }
        }
    }

    return <div className={st.view}>
        <button className={cl(st.button, st.button_border_right)} onClick={quantity_down} >
            -
        </button>

        <input
            type="text"
            value={amount}
            placeholder={`0`}
            className={st.input}

            onKeyDown={(ev) => {
                if (props.hook_action?.() !== false) {
                    switch (ev.key.toLowerCase()) {
                        case "escape":
                        case "enter": {
                            ev.preventDefault()
                            ev.currentTarget.blur()

                            break
                        }
                        case "arrowup": {
                            ev.preventDefault()

                            quantity_up()

                            break
                        }
                        case "arrowdown": {
                            ev.preventDefault()

                            quantity_down()

                            break
                        }
                    }
                }
            }}

            onChange={ev => {
                if (props.hook_action?.() !== false) {
                    const value = ev.target.value

                    if (/^[0-9]*$/.test(value)) {
                        const parsed = quantity_normalize(Number.parseInt(value))

                        if (parsed >= 999) {
                            amount_set(`999`)
                        } else {
                            amount_set(value)
                        }

                        dispatch(rem.product.act.patch({
                            body: {
                                id: props.product_id,

                                patch: {
                                    quantity: parsed,
                                },
                            },
                        }))
                    }
                }
            }}
        />

        <button className={cl(st.button, st.button_border_left)} onClick={quantity_up} >
            +
        </button>

        <button
            className={cl(st.button, st.button_border_left, st.button_delete)}

            onClick={() => {
                if (props.hook_action?.() !== false) {
                    dispatch(rem.product.act.delete({
                        body: {
                            ids: [props.product_id],
                        },
                    }))
                }
            }}
        >
            <faw.FontAwesomeIcon icon={fas_trash.faTrashCan} />
        </button>
    </div>
}

export default ELProduct_Quantity
