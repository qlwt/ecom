import * as capi from "@fst/capi"
import * as cc from "@fst/config/client"
import * as asc from "@qyu/atom-state-core"
import type { Rem_Config } from "@src/rem/type/config"
import type { Rem_ImgActDelete_Config, Rem_ImgActDelete_RParams, Rem_Node, Rem_NodeDef, Rem_Result } from "@src/rem/type/result"
import { remx_auth__state } from "@src/remx/auth/internal/state"
import { promise_new_remdeps } from "@src/util/promise/remdeps"

export type NRemAct_NewImgDelete_Params<TName extends keyof cc.RemDefImg> = {
    readonly table_name: TName
    readonly config: Rem_ImgActDelete_Config
    readonly rparams: Rem_ImgActDelete_RParams<TName>

    readonly rem_config: Rem_Config
    readonly rem_new: () => Rem_Result
}

export const nrem_act_new_img_delete = function <TName extends keyof cc.RemDefImg>(
    params: NRemAct_NewImgDelete_Params<TName>
): asc.AtomAction {
    return ({ reg }) => {
        const acc_state = reg(remx_auth__state)

        const action = function() {
            if (params.rparams.config?.signal_abort?.aborted) {
                return
            }

            const controller_abort = new AbortController()

            const promise = promise_new_remdeps({
                deps: params.config.deps ?? [],

                signal_abort: AbortSignal.any([
                    controller_abort.signal,
                    params.rparams.config?.signal_abort
                ].filter(s => s !== undefined)),

                request_new: l_params => capi.send_rest_img_delete(
                    params.table_name,
                    {
                        ...params.rparams,

                        config: {
                            ...params.rparams.config,

                            signal_abort: l_params.signal_abort,

                            hooks: {
                                ...params.rparams.config?.hooks,

                                noauth: () => {
                                    acc_state.real.input(asc.reqstate_new_empty())

                                    params.rparams.config?.hooks?.noauth?.()
                                },
                            },
                        },
                    }
                ),
            })

            for (const id of params.rparams.body.ids) {
                reg(asc.atomremnode_action_patch_set<Rem_NodeDef<TName>>({
                    name: "delete",

                    node: () => {
                        return reg(
                            params.rem_new()[params.table_name as "img"].register
                        ).reg({ id }) as any as Rem_Node<TName>
                    },

                    data: {
                        kind: "flat",
                        merge: false,

                        value: {
                            deleted: 1,
                        } as Partial<cc.RemDef[TName]["data"]>,
                    },

                    request: {
                        promise,

                        promise_abort: () => {
                            controller_abort.abort()
                        },

                        promise_interpret: (api) => {
                            if (api.result.success) {
                                return {
                                    deleted: 1
                                } as Partial<cc.RemDef[TName]["data"]>
                            }

                            return null
                        },
                    },
                }))
            }
        }

        const sub = () => {
            if (acc_state.real.output().status === asc.ReqState__Status.Fulfilled) {
                action()

                acc_state.real.rmsub(sub)
            }
        }

        {
            if (acc_state.real.output().status === asc.ReqState__Status.Fulfilled) {
                action()
            } else {
                acc_state.real.addsub(sub)
            }
        }
    }
}
