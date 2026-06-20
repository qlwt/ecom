type State<Src extends Promise<any>> = {
    finished: boolean
    cbs_failure: Failure[]
    cbs_cleanup: Cleanup[]
    cbs_success: Success<Src>[]
}

type Success<Src extends Promise<any>> = {
    (value: Awaited<Src>): any
}

type Failure = {
    (value: any): any
}

type Cleanup = {
    (): void
}

type Register_Params<Src extends Promise<any>> = {
    state: State<Src>
    root_params: Promise__Wrap_Params<Src>

    failure?: Failure | null | undefined
    cleanup?: Cleanup | null | undefined
    success?: Success<Src> | null | undefined
}

const register = function <Src extends Promise<any>>(params: Register_Params<Src>): Promise<any> {
    const {
        state,

        failure,
        success,
        cleanup,

        root_params: {
            src,
            wrapper
        }
    } = params

    if (state.finished) {
        if (success || failure) {
            const target = src.then(success, failure)

            if (cleanup) {
                return target.finally(cleanup)
            }

            return target
        } else if (cleanup) {
            return src.finally(cleanup)
        }

        return src
    } else {
        return new Promise((resolve, reject) => {
            if (failure || success) {
                state.cbs_failure.push(reason => {
                    state.finished = true

                    try {
                        if (failure) {
                            resolve(failure(reason))
                        } else {
                            reject(reason)
                        }
                    } catch (reason) {
                        reject(reason)
                    }
                })

                state.cbs_success.push(value => {
                    state.finished = true

                    try {
                        if (success) {
                            resolve(success(value))
                        } else {
                            resolve(value)
                        }
                    } catch (reason) {
                        reject(reason)
                    }
                })
            }

            if (state.cbs_failure.length === 1 || state.cbs_success.length === 1) {
                src.then(value => {
                    wrapper(() => {
                        state.cbs_success.forEach(cb => cb(value))
                    })

                    state.cbs_failure.length = 0
                    state.cbs_success.length = 0
                }, reason => {
                    wrapper(() => {
                        state.cbs_failure.forEach(cb => cb(reason))
                    })

                    state.cbs_failure.length = 0
                    state.cbs_success.length = 0
                })
            }

            if (cleanup) {
                state.cbs_cleanup.push(() => {
                    try {
                        cleanup()
                    } catch (reason) {
                        reject(reason)
                    }
                })

                if (state.cbs_cleanup.length === 1) {
                    src.finally(() => {
                        wrapper(() => {
                            state.cbs_cleanup.forEach(cb => cb())
                        })

                        state.cbs_cleanup.length = 0
                    })
                }
            }
        })
    }
}

export type Promise__Wrap_Params<Src extends Promise<any>> = {
    src: Src
    wrapper: (cb: VoidFunction) => void
}

export const promise_wrap = function <Src extends Promise<any>>(
    params: Promise__Wrap_Params<Src>
): Src extends Promise<infer A> ? Promise<A> : never {
    const state: State<Src> = {
        finished: false,
        cbs_failure: [],
        cbs_cleanup: [],
        cbs_success: [],
    }

    const wrapped = {
        [Symbol.toStringTag]: params.src[Symbol.toStringTag],

        then: (success, failure) => {
            return register({
                state,
                root_params: params,

                success,
                failure,
            })
        },

        catch: (failure) => {
            return register({
                state,
                root_params: params,

                failure,
            })
        },

        finally: (cleanup) => {
            return register({
                state,
                root_params: params,

                cleanup,
            })
        },
    } satisfies Promise<Awaited<Src>> as Src extends Promise<infer A> ? Promise<A> : never

    Object.setPrototypeOf(wrapped, Promise.prototype)

    return wrapped
}
