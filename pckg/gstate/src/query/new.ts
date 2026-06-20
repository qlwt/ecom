import { QueryStatus, type Query } from "@src/query/type/query";
import * as sc from "@qyu/signal-core"

export type Query_New_Api<Param, Search, Data> = {
    readonly param: Param
    readonly search: Search
    readonly signal_abort: AbortSignal
    readonly data: sc.Signal<Data, Data>
}

export type Query_New_Config<Search> = {
    readonly search: Search
    readonly retrydelay: number
}

export type Query_New_Params<Param, Search, Data> = {
    readonly init: Data
    readonly config: Query_New_Config<Search>
    readonly request_new: (api: Query_New_Api<Param, Search, Data>) => Promise<Data | undefined>
}

export const query_new = function <Param, Search, Data>(params: Query_New_Params<Param, Search, Data>): Query<Param, Search, Data> {
    let lasterror_timestamp: number | null = null
    let controller_abort: null | AbortController = null

    const data = sc.signal_new_value(params.init)
    const status = sc.signal_new_value(QueryStatus.Idle)

    return {
        data,
        status,
        search: params.config.search,

        cleanup: () => {
            if (controller_abort) {
                controller_abort.abort()

                controller_abort = null

                status.input(QueryStatus.Idle)
            }
        },

        load: param => {
            if (status.output() !== QueryStatus.Idle) {
                return
            }

            controller_abort = new AbortController()

            if (lasterror_timestamp !== null && Date.now() - lasterror_timestamp < params.config.retrydelay) {
                const signal_abort = controller_abort.signal

                setTimeout(
                    () => {
                        const promise = params.request_new({
                            data,
                            param,
                            signal_abort,
                            search: params.config.search,
                        })

                        status.input(QueryStatus.Pending)

                        promise.then(res => {
                            sc.batcher.batch_sync(() => {
                                status.input(QueryStatus.Idle)

                                if (res !== undefined) {
                                    data.input(res)
                                }
                            })
                        }, () => {
                            status.input(QueryStatus.Idle)

                            lasterror_timestamp = Date.now()
                        }).finally(() => {
                            controller_abort = null
                        })
                    },
                    params.config.retrydelay - (Date.now() - lasterror_timestamp)
                )
            } else {
                const promise = params.request_new({
                    data,
                    param,
                    search: params.config.search,
                    signal_abort: controller_abort.signal,
                })

                status.input(QueryStatus.Pending)

                promise.then(res => {
                    sc.batcher.batch_sync(() => {
                        status.input(QueryStatus.Idle)

                        if (res !== undefined) {
                            data.input(res)
                        }
                    })
                }, () => {
                    status.input(QueryStatus.Idle)

                    lasterror_timestamp = Date.now()
                }).finally(() => {
                    controller_abort = null
                })
            }
        }
    }
}
