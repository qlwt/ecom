import type { TokenScope } from "@src/type/scope"

export type Meta = {
    readonly state_aftername: boolean
    readonly scope: readonly TokenScope[]
}
