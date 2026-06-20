import * as capi from "@fst/capi"
import * as cc from "@fst/config/client"
import type * as rest from "@fst/rest"
import * as asc from "@qyu/atom-state-core"
import * as sc from "@qyu/signal-core"
import type { Rem_Config } from "@src/rem/type/config"
import type { Rem_DataActPost_Config, Rem_DataActPost_RParams, Rem_NodeDef, Rem_Result } from "@src/rem/type/result"
import { remx_auth__state } from "@src/remx/auth/internal/state"
import { promise_new_remdeps } from "@src/util/promise/remdeps"
import { promise_wrap } from "@src/util/promise/wrap"

type Post_Insert_Params<TName extends keyof cc.RemDefData> = {
    readonly table_name: TName
    readonly node: cc.RestData[TName]["post"]["body"][number]

    readonly rem: Rem_Result
    readonly rem_config: Rem_Config

    readonly promise: Promise<capi.ApiResponse<rest.RestRoutes_DataPostResult>>
    readonly promise_abort: VoidFunction
}

const post_insert = function <TName extends keyof cc.RemDefData>(params: Post_Insert_Params<TName>): asc.AtomAction {
    return ({ reg }) => {
        const node_core = params.node.core
        const creation_date = Date.now()

        const node_data = params.rem_config[params.table_name as "item"].node_convert(node_core as any, { creation_date })

        reg(asc.atomremnode_action_request_set<Rem_NodeDef<"item">, capi.ApiResponse<rest.RestRoutes_DataPostResult>>({
            optimistic: {
                fallback: true,
                data: node_data,
                node: () => reg(params.rem[params.table_name as "item"].register).reg({ id: node_core.id }),
            },

            request: {
                meta: null,
                promise: params.promise,
                promise_abort: params.promise_abort,

                promise_interpret: api => {
                    if (api.result.success) {
                        return {
                            ...node_data,

                            creation_date: api.result.body.creation_date,
                        } as const
                    }

                    return null
                },
            },
        }))

        for (const [join_key, join] of Object.entries(cc.remdef[params.table_name].joins.core)) {
            const target_rawdef = cc.remdef[join.target_table as keyof cc.RemDef]

            if (join_key in params.node.joins && target_rawdef.kind === "data") {
                if (join.kind === "forwards") {
                    const join_imp = params.node.joins[join_key as keyof typeof params.node.joins] as {}

                    reg(post_insert({
                        rem: params.rem,
                        rem_config: params.rem_config,
                        promise: params.promise,
                        promise_abort: params.promise_abort,

                        node: join_imp as any,
                        table_name: join.target_table as keyof cc.RemDefData,
                    }))
                } else if (join.kind === "backwards") {
                    const join_imps = params.node.joins[join_key as keyof typeof params.node.joins] as {}[]

                    for (const join_imp of join_imps) {
                        reg(post_insert({
                            rem: params.rem,
                            rem_config: params.rem_config,
                            promise: params.promise,
                            promise_abort: params.promise_abort,

                            node: join_imp as any,
                            table_name: join.target_table as keyof cc.RemDefData,
                        }))
                    }
                } else {
                    throw new Error(`Unexpected join.kind ${join.kind}`)
                }
            }
        }
    }
}

export type NRemAct_NewDataPost_Params<TName extends keyof cc.RemDefData> = {
    readonly table_name: TName
    readonly config: Rem_DataActPost_Config
    readonly rparams: Rem_DataActPost_RParams<TName>

    readonly rem_config: Rem_Config
    readonly rem_new: () => Rem_Result
}

export const nrem_act_new_data_post = function <TName extends keyof cc.RemDefData>(
    params: NRemAct_NewDataPost_Params<TName>
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
                    params.rparams.config?.signal_abort,
                ].filter(s => s !== undefined)),

                request_new: l_params => promise_wrap({
                    wrapper: sc.batcher.batch_sync,

                    src: capi.send_rest_data_post(
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
                            }
                        }
                    )
                }),
            })

            sc.batcher.batch_sync(() => {
                const rem = params.rem_new()

                for (const node of params.rparams.body) {
                    reg(post_insert({
                        rem,
                        node,
                        rem_config: params.rem_config,
                        table_name: params.table_name,

                        promise,
                        promise_abort: () => { controller_abort.abort() },
                    }))
                }
            })
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
