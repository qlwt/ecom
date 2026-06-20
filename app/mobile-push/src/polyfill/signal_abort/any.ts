if (typeof AbortSignal !== 'undefined' && !AbortSignal.any) {
    AbortSignal.any = function(signals) {
        const controller = new AbortController()

        for (const signal of signals) {
            if (signal.aborted) {
                controller.abort(signal.reason)

                return controller.signal
            }
        }

        const unsub = () => {
            for (const signal of signals) {
                signal.removeEventListener('abort', listener_abort)
            }
        }

        const listener_abort = () => {
            controller.abort()

            unsub()
        }

        for (const signal of signals) {
            signal.addEventListener('abort', listener_abort)
        }

        return controller.signal
    }
}
