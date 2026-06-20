import st from "@client/component/feature/home-view/style/sec_variant.module.scss"
import * as gs from "@fst/gstate"
import { rem } from "@fst/gstate"
import * as asr from "@qyu/atom-state-react"
import { EFHomeView_ModalState } from "@src/client/component/feature/home-view/type/modalstate"
import { EFHomeView_Selection_Kind, type EFHomeView_Selection } from "@src/client/component/feature/home-view/type/selection"
import { efhomeview_tls_new_variant_custom } from "@src/client/component/feature/home-view/util/tls/new/variant_custom"
import { useAuthAcc } from "@src/client/hook/auth/acc"
import type { FnSetterStateles } from "@src/client/type/fns"
import { remclone_variant } from "@src/client/util/remclone/variant"
import cl from "classnames"
import * as r from "react"
import * as ri18 from "react-i18next"
import { v7 as uuid } from "uuid"

type Data_Variant = gs.Rem_JoinData<"variant">

export type ELHomeView__Modal_CustomVariant_Props = {
    readonly modal_set: FnSetterStateles<EFHomeView_ModalState>

    readonly variant: Data_Variant | null
    readonly variant_select: FnSetterStateles<EFHomeView_Selection>
}

export const ELHomeView_Modal_CustomVariant: r.FC<ELHomeView__Modal_CustomVariant_Props> = props => {
    const { t } = ri18.useTranslation()
    const dispatch = asr.useAtomDispatch()

    const acc = useAuthAcc()

    const ref_lastfocus = r.useRef<HTMLElement | null>(null)
    const ref_btn = r.useRef<HTMLButtonElement | null>(null)

    // manage focus
    r.useEffect(() => {
        {
            const old_focus = document.activeElement

            if (old_focus && old_focus instanceof HTMLElement) {
                ref_lastfocus.current = old_focus
            }
        }

        {
            ref_btn.current?.focus()
        }

        return () => {
            const lastfocus = ref_lastfocus.current

            if (lastfocus && lastfocus.isConnected) {
                lastfocus.focus()
            }
        }
    }, [])

    // manage keybinds
    r.useEffect(() => {
        const controller_abort = new AbortController()

        document.addEventListener("keydown", ev => {
            if (ev.key.toLowerCase() === "escape" && !(ev.ctrlKey || ev.altKey || ev.shiftKey || ev.metaKey)) {
                props.modal_set(EFHomeView_ModalState.None)
            }
        })

        return () => {
            controller_abort.abort()
        }
    }, [props.modal_set])

    return <div className={st.overlay}>
        <div className={st.dialog}>
            <div className={st.dialog__head}>
                <h2 className={st.dialog__head__text}>
                    {t(`item.modal.you_can_make_custom_variant`)}
                </h2>
            </div>

            <div className={st.dialog__btns}>
                <button
                    ref={ref_btn}
                    className={cl(st.dialog__btn, st._cancel)}

                    onClick={() => {
                        props.modal_set(EFHomeView_ModalState.None)
                    }}
                >
                    {t(`commons.cancel`)}
                </button>

                <button
                    className={cl(st.dialog__btn, st._submit)}

                    onClick={() => {
                        if (!acc || !props.variant) {
                            return
                        }

                        const prodset_id = uuid()
                        const variant_id = uuid()

                        dispatch(rem.variant.act.post({
                            body: [remclone_variant({
                                ignore: {},
                                src: props.variant,

                                overrides: {
                                    owner: acc.id,

                                    prodset_id,

                                    variant_id,
                                    status_hidden: 0,
                                    variant_header: "Custom",
                                    variant_description: "Custom variant created by user",

                                    tl: efhomeview_tls_new_variant_custom(),
                                },
                            })],
                        }))

                        props.modal_set(EFHomeView_ModalState.None)

                        props.variant_select({
                            kind: EFHomeView_Selection_Kind.Selection,
                            id: variant_id
                        })
                    }}
                >
                    {t(`item.create_variant`)}
                </button>
            </div>
        </div>
    </div>
}
