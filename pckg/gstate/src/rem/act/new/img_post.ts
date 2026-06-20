import * as capi from "@fst/capi"
import * as cc from "@fst/config/client"
import type * as rest from "@fst/rest"
import * as asc from "@qyu/atom-state-core"
import type { Rem_Config } from "@src/rem/type/config"
import type { Rem_ImgActPost_Config, Rem_ImgActPost_RParams, Rem_NodeDef, Rem_Result } from "@src/rem/type/result"
import { remx_auth__state } from "@src/remx/auth/internal/state"
import { promise_new_remdeps } from "@src/util/promise/remdeps"

export type NRemAct_NewImgPost_Params<TName extends keyof cc.RemDefImg> = {
    readonly table_name: TName
    readonly config: Rem_ImgActPost_Config
    readonly rparams: Rem_ImgActPost_RParams<TName>

    readonly rem_config: Rem_Config
    readonly rem_new: () => Rem_Result
}

export const nrem_act_new_img_post = function <TName extends keyof cc.RemDefImg>(
    params: NRemAct_NewImgPost_Params<TName>
): asc.AtomAction {
    return ({ reg }) => {
        const acc_state = reg(remx_auth__state)

        const action = async function() {
            if (params.rparams.config?.signal_abort?.aborted) {
                return
            }

            const rem = params.rem_new()
            const creation_date = Date.now()
            const node_core = params.rparams.body
            const node_files = params.rparams.files_raw

            const node_data = params.rem_config[params.table_name as "img"].node_convert(
                node_core,
                { creation_date, },
                { files: node_files },
            )

            reg(asc.atomremnode_action_request<Rem_NodeDef<"img">, capi.ApiResponse<rest.RestRoutes_ImgPostResult>>({
                optimistic: {
                    fallback: true,
                    data: node_data,
                    node: () => reg(rem[params.table_name as "img"].register).reg({ id: params.rparams.body.id }),
                },

                request: () => {
                    const controller_abort = new AbortController()

                    const promise = promise_new_remdeps({
                        deps: params.config.deps ?? [],

                        signal_abort: AbortSignal.any([
                            controller_abort.signal,
                            params.rparams.config?.signal_abort,
                        ].filter(s => s !== undefined)),

                        request_new: l_params => capi.send_rest_img_post(
                            params.table_name,
                            {
                                ...params.rparams,

                                files: () => {
                                    return params.rparams.files_process(params.rparams.files_raw)
                                },

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
                                }
                            }
                        ),
                    })

                    return {
                        promise,
                        meta: null,
                        promise_abort: () => { controller_abort.abort() },

                        promise_interpret: api => {
                            if (api.result.success) {
                                return {
                                    ...node_data,

                                    creation_date: api.result.body.creation_date,
                                }
                            }

                            return null
                        },
                    }
                },
            }))
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
