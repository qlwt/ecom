import * as sc from "@qyu/signal-core"

export enum PaginatorList_Status {
    Idle = "IDLE",
    Pending = "PENDING",
    Fulfilled = "FULFILLED",
}

export type PaginatorList<Data, Search, Limit> = Readonly<{
    search: Search
    cleanup: () => void
    load: (limit: Limit) => void
    status: sc.OSignal<PaginatorList_Status>
    data: sc.Signal<readonly Data[], readonly Data[]>
}>
