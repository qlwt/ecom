import { rem } from "@src/rem"
import { nrem_join_new_standalone } from "@src/rem/join/new_standalone"
import type { Rem_JoinStandaloneFactory } from "@src/rem/type/result"
import { remx_auth__state } from "@src/remx/auth/internal/state"

export const remx_auth__joins_core = function(): Rem_JoinStandaloneFactory<"acc", "core"> {
    return nrem_join_new_standalone({
        rem_new: () => rem,
        table_name: "acc",
        self_variant: "core",

        node_new: () => {
            return ({ reg }) => reg(remx_auth__state)
        }
    })
}
