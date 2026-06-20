import * as r from "react"

type UseMemoThrottle_Params<T> = {
    readonly cb: () => T
    readonly delay: number
    readonly deps_upd: unknown[]
    readonly deps_force?: unknown[]
}

export const useMemoThrottle = function <T>(params: UseMemoThrottle_Params<T>) {
    const ref_calc = r.useRef(params.cb)
    const ref_initial_upd = r.useRef(true)
    const ref_initial_force = r.useRef(true)
    const ref_timer = r.useRef<null | NodeJS.Timeout>(null)

    const [state, state_set] = r.useState(params.cb)

    r.useEffect(() => {
        ref_calc.current = params.cb
    }, [params.cb])

    r.useEffect(() => {
        if (ref_initial_upd.current === true) {
            ref_initial_upd.current = false

            return
        }

        if (!ref_timer.current) {
            ref_timer.current = setTimeout(() => {
                state_set(ref_calc.current())

                ref_timer.current = null
            }, params.delay)
        }
    }, params.deps_upd)

    r.useEffect(() => {
        if (ref_initial_force.current === true) {
            ref_initial_force.current = false

            return
        }

        if (ref_timer.current !== null) {
            clearTimeout(ref_timer.current)

            ref_timer.current = null

            state_set(ref_calc.current())
        } else {
            state_set(ref_calc.current())
        }
    }, params.deps_force ?? [])

    return state
}
