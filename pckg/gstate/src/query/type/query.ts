import * as sc from "@qyu/signal-core"

export enum QueryStatus {
    Idle,
    Pending
}

export type Query<Param, Search, Data> = {
    readonly search: Search
    readonly cleanup: VoidFunction
    readonly data: sc.Signal<Data, Data>
    readonly load: (param: Param) => void
    readonly status: sc.OSignal<QueryStatus>
}
