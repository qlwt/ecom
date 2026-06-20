import type { ApiResponse_Events } from "@src/res/event"
import type { Fetch_NewRestore_Hooks } from "@src/util/fetch/new/restore"

export type SendConfig<Res> = {
    readonly signal_abort?: AbortSignal
    readonly hooks?: Fetch_NewRestore_Hooks 
    readonly events?: ApiResponse_Events<Res>
}
