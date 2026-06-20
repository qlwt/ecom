import * as sc from "@qyu/signal-core"
import { PaginatorList_Status, type PaginatorList } from "@src/paginator/type/list"

export type Paginator__NewList_Response<Cursor> = Readonly<{
    cursor: Cursor | null
}>

export type Paginator__NewList_Config<Search> = Readonly<{
    search: Search
    retrydelay: number
}>

export type Paginator__NewList_RequestApi<Data, Search, Cursor, Limit> = Readonly<{
    limit: Limit
    cursor: Cursor
    search: Search
    signal_abort: AbortSignal
    data: sc.Signal<readonly Data[], readonly Data[]>
}>

export type Paginator__NewList_Init<Data, Cursor, Limit> = Readonly<{
    cursor: Cursor
    data: readonly Data[]
}>

export type Paginator__NewList_Params<Data, Search, Cursor, Limit> = Readonly<{
    config: Paginator__NewList_Config<Search>
    init: Paginator__NewList_Init<Data, Cursor, Limit>
    request_new: (api: Paginator__NewList_RequestApi<Data, Search, Cursor, Limit>) => Promise<Paginator__NewList_Response<Cursor>>
}>

export const paginator_new_list = function <Data, Search, Cursor, Limit>(
    params: Paginator__NewList_Params<Data, Search, Cursor, Limit>
): PaginatorList<Data, Search, Limit> {
    let cursor: Cursor = params.init.cursor
    let lasterror_timestamp: number | null = null
    let controller_abort: AbortController | undefined

    const search = params.config.search
    const data = sc.signal_new_value(params.init.data)
    const status = sc.signal_new_value(PaginatorList_Status.Idle)

    return {
        data,
        status,
        search,

        load: (limit: Limit) => {
            if (status.output() === PaginatorList_Status.Idle) {
                controller_abort = new AbortController()

                status.input(PaginatorList_Status.Pending)

                if (lasterror_timestamp !== null && Date.now() - lasterror_timestamp < params.config.retrydelay) {
                    const signal_abort = controller_abort.signal

                    setTimeout(
                        () => {
                            const request = params.request_new({
                                data,
                                limit,
                                cursor,
                                search,
                                signal_abort
                            })

                            request.then(response => {
                                if (response.cursor === null) {
                                    status.input(PaginatorList_Status.Fulfilled)
                                } else {
                                    cursor = response.cursor

                                    status.input(PaginatorList_Status.Idle)
                                }
                            }, (e) => {
                                status.input(PaginatorList_Status.Idle)

                                lasterror_timestamp = Date.now()
                            }).finally(() => {
                                controller_abort = undefined
                            })
                        },
                        params.config.retrydelay - (Date.now() - lasterror_timestamp)
                    )
                } else {
                    const request = params.request_new({
                        data,
                        limit,
                        cursor,
                        search,
                        signal_abort: controller_abort.signal
                    })

                    request.then(response => {
                        if (response.cursor === null) {
                            status.input(PaginatorList_Status.Fulfilled)
                        } else {
                            cursor = response.cursor

                            status.input(PaginatorList_Status.Idle)
                        }
                    }, (e) => {
                        status.input(PaginatorList_Status.Idle)

                        lasterror_timestamp = Date.now()
                    }).finally(() => {
                        controller_abort = undefined
                    })
                }
            }
        },

        cleanup: () => {
            if (controller_abort) {
                controller_abort.abort()
            }
        },
    }
}
