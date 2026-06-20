import st from "@client/component/feature/pingme/style/index.module.scss"
import * as capi from "@fst/capi"
import * as cst from "@fst/cst"
import * as rfl from "@qyu/reactcmp-flow-control"
import ELPingMe_Btn from "@src/client/component/feature/pingme/local/btn"
import ELPingMe_Msg from "@src/client/component/feature/pingme/local/msg"
import { EFPingMe__MsgKind, type EFPingMe_Msg } from "@src/client/component/feature/pingme/type/msg"
import EPIcon_FA from "@src/client/component/primitive/icon/element/view"
import { useAuthAcc } from "@src/client/hook/auth/acc"
import { useStateCache } from "@src/client/hook/statecache"
import type { Icon_Shortcut } from "@src/client/util/icon/type/shortcut"
import cl from "classnames"
import * as r from "react"
import * as ri18 from "react-i18next"
import * as rmask from "react-imask"
import { v7 as uuid } from "uuid"

const modes = [
    cst.PingMe_ContactMethod.Phone,
    cst.PingMe_ContactMethod.Viber,
    cst.PingMe_ContactMethod.Telegram,
]

const icons = {
    [cst.PingMe_ContactMethod.Phone]: `phone`,
    [cst.PingMe_ContactMethod.Viber]: `viber`,
    [cst.PingMe_ContactMethod.Telegram]: `telegram`,
} satisfies Record<cst.PingMe_ContactMethod, Icon_Shortcut>

type Msgs = {
    [K in cst.PingMe_ContactMethod]?: readonly EFPingMe_Msg[]
}

export type EFPingMe__View_Props = {
}

export const EFPingMe_View: r.FC<EFPingMe__View_Props> = () => {
    const { t } = ri18.useTranslation()
    const ref_msgs = r.useRef<HTMLDivElement | null>(null)
    const ref_root = r.useRef<HTMLDivElement | null>(null)

    const { ref: ref_input_mask, setValue: phone_setvalue } = rmask.useIMask({ mask: "(000) 000 00 00" })

    const acc = useAuthAcc()

    const [phone, phone_set] = r.useState("")
    const [status_open, status_open_set] = r.useState(false)
    const [msgs, msgs_set] = useStateCache<Msgs>("EFPingMe_View::state::msgs", {})
    const [cmethod, cmethod_set] = useStateCache("EFPingMe_View::state::cmethod", modes[0]!)
    const [status_showmessage, status_showmessage_set] = useStateCache("EFPingMe_View::state::status_showmessage", true)

    r.useEffect((): VoidFunction | void => {
        if (status_open) {
            const controller_abort = new AbortController()

            document.addEventListener("keydown", ev => {
                switch (ev.key.toLowerCase()) {
                    case "escape": {
                        if (!(ev.altKey || ev.ctrlKey || ev.metaKey || ev.shiftKey)) {
                            status_open_set(false)
                        }

                        break
                    }
                }
            }, { signal: controller_abort.signal })

            document.addEventListener("click", ev => {
                const root = ref_root.current
                const path = ev.composedPath()

                if (root && !path.includes(root)) {
                    status_open_set(false)
                }
            }, { signal: controller_abort.signal })

            return () => {
                controller_abort.abort()
            }
        }
    }, [status_open])

    r.useEffect(() => {
        ref_msgs.current?.scrollTo({
            behavior: "instant",
            top: ref_msgs.current.scrollHeight,
        })
    }, [msgs])

    return <div ref={ref_root} className={cl(st.root, status_open && st._open)}>
        <div className={st.sec_view}>
            <div className={st.sec_msgs} ref={ref_msgs}>
                <ELPingMe_Msg kind={"partner"}>
                    {t(`pingme.msg_hello`)}
                </ELPingMe_Msg>

                <rfl.CmpLoop data={msgs[cmethod]}>
                    {msg => {
                        switch (msg.kind) {
                            case EFPingMe__MsgKind.UsrPhone: {
                                return <ELPingMe_Msg key={`msg:${msg.id}`} kind={"mine"}>
                                    {
                                        `+38 `
                                        + `(${msg.phone.slice(0, 3)}) `
                                        + `${msg.phone.slice(3, 6)} `
                                        + `${msg.phone.slice(6, 8)} `
                                        + `${msg.phone.slice(8, 10)}`
                                    }
                                </ELPingMe_Msg>
                            }
                            case EFPingMe__MsgKind.ResPending: {
                                return <ELPingMe_Msg key={`res:${msg.id}`} kind={"partner"}>
                                    <div className={st.msg__pending__root}>
                                        <div className={st.msg__pending__dot} />
                                        <div className={st.msg__pending__dot} />
                                        <div className={st.msg__pending__dot} />
                                    </div>
                                </ELPingMe_Msg>
                            }
                            case EFPingMe__MsgKind.ResSuccess: {
                                return <ELPingMe_Msg key={`res:${msg.id}`} kind={"partner"}>
                                    {t("pingme.msg_success")}
                                </ELPingMe_Msg>
                            }
                            case EFPingMe__MsgKind.ResFailInternal: {
                                return <ELPingMe_Msg key={`res:${msg.id}`} kind={"partner"}>
                                    {t("pingme.msg_failinternal")}
                                </ELPingMe_Msg>
                            }
                            case EFPingMe__MsgKind.ResFailAlreadyPending: {
                                return <ELPingMe_Msg key={`res:${msg.id}`} kind={"partner"}>
                                    {t("pingme.msg_success")}
                                </ELPingMe_Msg>
                            }
                        }
                    }}
                </rfl.CmpLoop>
            </div>

            <div className={st.sec_input}>
                <input
                    ref={element => { ref_input_mask.current = element }}

                    defaultValue={phone}
                    className={st.inmsg__input}
                    placeholder={`(000) 000 00 00`}

                    onChange={ev => {
                        phone_set(ev.target.value.replace(/\D+/g, ""))
                    }}
                />

                <button
                    className={st.inmsg__btn}
                    disabled={phone.length < 10}

                    onClick={() => {
                        if (!acc) { return }

                        const res_id = uuid()

                        capi.send_restx_ping_push({
                            body: {
                                phone,
                                acc_id: acc.id,
                                cmethod: cmethod,
                            },

                            config: {
                                events: {
                                    failure: (reason) => {
                                        switch (reason) {
                                            case cst.ServerError.AlreadyPending: {
                                                msgs_set(old_msgs => {
                                                    return {
                                                        ...old_msgs,

                                                        [cmethod]: (old_msgs[cmethod] ?? []).map((msg) => {
                                                            if (msg.id === res_id) {
                                                                return {
                                                                    ...msg,

                                                                    kind: EFPingMe__MsgKind.ResSuccess,
                                                                }
                                                            }

                                                            return msg
                                                        })
                                                    }
                                                })

                                                break
                                            }
                                            default: {
                                                msgs_set(old_msgs => {
                                                    return {
                                                        ...old_msgs,

                                                        [cmethod]: (old_msgs[cmethod] ?? []).map((msg) => {
                                                            if (msg.id === res_id) {
                                                                return {
                                                                    ...msg,

                                                                    kind: EFPingMe__MsgKind.ResFailInternal,
                                                                }
                                                            }

                                                            return msg
                                                        })
                                                    }
                                                })

                                                break
                                            }
                                        }
                                    },

                                    success: () => {
                                        msgs_set(old_msgs => {
                                            return {
                                                ...old_msgs,

                                                [cmethod]: (old_msgs[cmethod] ?? []).map((msg) => {
                                                    if (msg.id === res_id) {
                                                        return {
                                                            ...msg,

                                                            kind: EFPingMe__MsgKind.ResSuccess,
                                                        }
                                                    }

                                                    return msg
                                                })
                                            }
                                        })
                                    },
                                },
                            }
                        })

                        msgs_set(old_msgs => {
                            return {
                                ...old_msgs,

                                [cmethod]: [
                                    ...(old_msgs[cmethod] ?? []),
                                    {
                                        id: uuid(),
                                        kind: EFPingMe__MsgKind.UsrPhone,
                                        phone: phone.replace(/\D+/g, ""),
                                    } satisfies EFPingMe_Msg,
                                    {
                                        id: res_id,
                                        kind: EFPingMe__MsgKind.ResPending
                                    }
                                ]
                            }
                        })

                        phone_set("")
                        phone_setvalue("")
                    }}
                >
                    <EPIcon_FA def={`paper-plane`} />
                </button>
            </div>
        </div>

        <div className={st.sec_btns}>
            <button
                className={cl(st.bubble, status_showmessage && st._show)}

                onClick={() => {
                    status_showmessage_set(false)
                }}
            >
                {t(`pingme.question_1`)}
            </button>

            <rfl.CmpLoop data={modes}>
                {(mode, index) => <ELPingMe_Btn
                    key={`mode:${mode}`}

                    order={index}
                    status_open={status_open}
                    status_selected={mode === cmethod}
                    className={st[`_iconmode_${icons[mode]}`]}

                    event_click={() => {
                        cmethod_set(mode)
                        status_open_set(true)
                        status_showmessage_set(false)
                    }}
                >
                    <EPIcon_FA def={icons[mode]} />
                </ELPingMe_Btn>}
            </rfl.CmpLoop>
        </div>
    </div>
}

export default EFPingMe_View
