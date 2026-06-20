import * as asc from "@qyu/atom-state-core"
import type { RemXAuth_NodeDef } from "@src/remx/auth/type/acc"

export const remx_auth__state = asc.atomremnode_new<RemXAuth_NodeDef>({
    init: () => null,
    statics: () => ({}),
})
