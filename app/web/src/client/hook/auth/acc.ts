import { remx } from "@fst/gstate"
import * as asr from "@qyu/atom-state-react"
import * as sc from "@qyu/signal-core"
import * as sr from "@qyu/signal-react"
import * as r from "react"

export const useAuthAcc = function() {
    return sr.useSignalOutput(asr.useAtomValue(
        r.useCallback(({ reg }) => {
            return sc.osignal_new_memo(
                sc.osignal_new_pipe(
                    reg(remx.auth.joins.core())({}),
                    join => join?.data ?? null
                ),
                null
            )
        }, [])
    ))
}
