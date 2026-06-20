import type { TokenScope } from "@src/type/scope"

export type Meta = {
    readonly state_charge: 0 | 1 | 2 | 3
    readonly scope: readonly TokenScope[]
}
