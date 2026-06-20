import st_base from "@client/component/feature/acc-profile/style/view.module.scss"
import st from "@client/component/feature/acc-profile/style/view_info.module.scss"
import stheme_intext_form from "@client/component/primitive/in-text/style/white.module.scss"
import * as capi from "@fst/capi"
import * as cc from "@fst/config/client"
import * as gs from "@fst/gstate"
import { gv, rem, remx } from "@fst/gstate"
import * as asr from "@qyu/atom-state-react"
import * as rfl from "@qyu/reactcmp-flow-control"
import * as rmdl from "@qyu/reactcmp-modal"
import * as sc from "@qyu/signal-core"
import ELAccProfile_CardAuthEmail from "@src/client/component/feature/acc-profile/local/card_authemail"
// import ELAccProfile_CardAuthGoogle from "@src/client/component/feature/acc-profile/local/card_authgoogle"
import ELAccProfile_InfoForm from "@src/client/component/feature/acc-profile/local/info_form"
import EPInText_Input from "@src/client/component/primitive/in-text/element/input"
import EPInText_ViewWeak from "@src/client/component/primitive/in-text/element/view_weak"
import { array_new_mapfilter } from "@src/client/util/array/new/mapfilter"
import cl from "classnames"
import * as r from "react"
import * as ri18 from "react-i18next"

const randid = function(length: number): string {
    let result = ""

    for (let i = 0; i < length; ++i) {
        result += Math.floor(Math.random() * 10).toString()
    }

    return result
}

type EL__ActDelete_Props = {
    readonly acc: cc.RemDef["acc"]["joins"]["core"] | null
}

const EL_ActDelete: r.FC<EL__ActDelete_Props> = props => {
    const { t } = ri18.useTranslation()
    const dispatch = asr.useAtomDispatch()

    const [show, show_set] = r.useState(false)
    const [status_pending, status_pending_set] = r.useState(false)

    const [code_field, code_field_set] = r.useState("")
    const [code_gen, code_gen_set] = r.useState(() => randid(5))

    return <>
        <rmdl.CmpOverlayAnimated show={show} animation_velocity={5e-3}>
            <rmdl.CmpFGAnimFade show_set={show_set}>
                <div className={st.modal}>
                    <div className={st.modal__form}>
                        <h2 className={cl(st.modal__form__title, st._red)}>
                            Account Deletion
                        </h2>

                        <p className={cl(st.modal__form__description)}>
                            {t("user.modal_delete_account_desc_1")}
                            <br />
                            <br />
                            {t("user.modal_delete_account_desc_2")}
                            <b>{code_gen}</b>
                        </p>

                        <EPInText_ViewWeak
                            value={``}
                            state_disabled={status_pending}
                            stmod={stheme_intext_form}
                            value_validator={v => v === code_gen}
                        >
                            <EPInText_Input
                                placeholder={code_gen}
                                event_value_change={code_field_set}
                            />
                        </EPInText_ViewWeak>

                        <div className={st.modal__form__acts}>
                            <button
                                disabled={status_pending}
                                className={cl(st.modal__form__act, st._blue)}

                                onClick={() => {
                                    show_set(false)
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                disabled={code_gen !== code_field || status_pending}
                                className={cl(st.modal__form__act, st._red)}

                                onClick={() => {
                                    if (props.acc) {
                                        status_pending_set(true)

                                        dispatch(remx.auth.act.delete({
                                            body: {
                                                ids: [props.acc.id],
                                            },

                                            config: {
                                                events: {
                                                    success: () => {
                                                        window.location.replace("/")
                                                    },

                                                    failure: () => {
                                                        dispatch(gv.report.act.push_error({
                                                            text: t(`popups.error.account_delete_default`)
                                                        }))
                                                    },

                                                    cleanup: () => {
                                                        status_pending_set(false)
                                                    },
                                                }
                                            },
                                        }))
                                    }
                                }}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            </rmdl.CmpFGAnimFade>
        </rmdl.CmpOverlayAnimated>

        <button
            className={st.act_delete}

            onClick={() => {
                show_set(t => !t)
                code_gen_set(randid(5))
            }}
        >
            {t("user.act_deleteacc")}
        </button>
    </>
}

const useLoad = (dbkey: "acc_authemail", acc_id: string | null) => {
    const store = asr.useAtomStore()

    const query = r.useMemo(() => {
        if (acc_id) {
            return gs.query_new({
                init: null,

                config: {
                    search: "",
                    retrydelay: 5000,
                },

                request_new: () => {
                    return capi.send_rest_data_get(dbkey, {
                        query: {
                            limit: 100,
                            cursor: null,
                            pick_owner: [acc_id],

                            include_hidden: null,
                        },
                    }).then(result => {
                        if (result.success) {
                            sc.batcher.batch_sync(() => {
                                store.dispatch(gs.nrem_dbslice_use(rem, result.body.slice))
                            })
                        } else {
                            throw result.reason
                        }
                    })
                },
            })
        }

        return null
    }, [dbkey, acc_id, store])

    r.useEffect((): VoidFunction | void => {
        if (query) {
            query.load(null)

            return () => {
                query.cleanup()
            }
        }
    }, [query])
}

export type EFAccProfile__ViewInfo_Props = {
}

export const EFAccProfile_ViewInfo: r.FC<EFAccProfile__ViewInfo_Props> = props => {
    const acc = asr.useAtomOutput(r.useMemo(() => {
        return ({ reg }) => {
            return sc.osignal_new_memo(reg(remx.auth.joins.core())({}), null)
        }
    }, []))

    const auth_email = asr.useAtomOutput(r.useMemo(() => {
        return ({ reg }) => {
            return sc.osignal_new_memo(sc.osignal_new_pipeflat(
                sc.osignal_new_listpipe(
                    reg(rem.acc_authemail.indexer_new(["deleted", "owner"] as const)).reg({
                        deleted: 0,
                        owner: acc?.data?.id ?? "never"
                    }),
                    node => {
                        return reg(rem.acc_authemail.joins.core())({
                            id: node.statics.id,
                        })
                    }
                ),
                nodes_s => sc.osignal_new_pipe(
                    sc.osignal_new_merge(nodes_s),
                    nodes => {
                        return array_new_mapfilter(nodes, node => {
                            if (node && node.data && node.data.deleted === 0) {
                                return node.data
                            }

                            return null
                        })
                    }
                )
            ))
        }
    }, [acc?.data?.id]))

    // const auth_google = asr.useAtomOutput(r.useMemo(() => {
    //     return ({ reg }) => {
    //         return sc.osignal_new_memo(sc.osignal_new_pipeflat(
    //             sc.osignal_new_listpipe(
    //                 reg(rem.acc_authgoogle.indexer_flat.acc).reg({
    //                     deleted: 0,
    //                     acc_id: acc?.data?.id ?? "never"
    //                 }),
    //                 node => {
    //                     return reg(rem.acc_authgoogle.sel.join())({
    //                         id: node.statics.id,
    //                     })
    //                 }
    //             ),
    //             nodes_s => sc.osignal_new_pipe(
    //                 sc.osignal_new_merge(nodes_s),
    //                 nodes => {
    //                     return array_new_mapfilter(nodes, node => {
    //                         if (node && node.data && node.data.deleted === 0) {
    //                             return node.data
    //                         }
    //
    //                         return null
    //                     })
    //                 }
    //             )
    //         ), null)
    //     }
    // }, [acc?.data?.id]))

    useLoad("acc_authemail", acc?.data?.id ?? null)
    // useLoad("acc_authgoogle", acc?.data?.id ?? null)

    return <section className={st_base.root}>
        <div className={st.view}>
            <rfl.CmpRequire value={[acc?.data] as const}>
                {([acc_data]) => {
                    return <ELAccProfile_InfoForm
                        acc={acc_data}
                    />
                }}
            </rfl.CmpRequire>

            <div className={st.authlist}>
                <rfl.CmpLoop data={auth_email}>
                    {node => {
                        return <ELAccProfile_CardAuthEmail
                            key={node.id}
                            node={node}
                        />
                    }}
                </rfl.CmpLoop>

                {/* <rfl.CmpLoop data={auth_google}> */}
                {/*     {node => { */}
                {/*         return <ELAccProfile_CardAuthGoogle */}
                {/*             key={node.id} */}
                {/*             node={node} */}
                {/*         /> */}
                {/*     }} */}
                {/* </rfl.CmpLoop> */}
            </div>

            <div className={st.acts}>
                <EL_ActDelete acc={acc?.data ?? null} />
            </div>
        </div>
    </section>
}

export default EFAccProfile_ViewInfo
