import type { ReduceConfig } from "@src/type/reduce";

type ArgType = number | null

export const config_base = function(overrides: Partial<ReduceConfig>): ReduceConfig {
    return {
        vars: {
            ...overrides.vars,
        },

        fns: {
            max: (...params: ArgType[]) => {
                const filtered = params.filter(n => n !== null)

                if (filtered.length === 0) {
                    return null
                }

                return Math.max.apply(Math, filtered)
            },

            min: (...params: ArgType[]) => {
                const filtered = params.filter(n => n !== null)

                if (filtered.length === 0) {
                    return null
                }

                return Math.min.apply(Math, filtered)
            },

            and: (...params: ArgType[]) => {
                for (let param of params) {
                    if (!param) {
                        return 0
                    }
                }

                return 1
            },

            or: (...params: ArgType[]) => {
                for (let param of params) {
                    if (param) {
                        return 1
                    }
                }

                return 0
            },
            
            exists: (...params: ArgType[]) => {
                if (params.length !== 1) {
                    throw new Error(`Function Exectuion: exists. Expected 1 parameter, got ${params.length}`)
                }

                const param= params[0]

                if (param === null) {
                    return 0
                }

                return 1
            },

            not: (...params: ArgType[]) => {
                if (params.length !== 1) {
                    throw new Error(`Function Exectuion: not. Expected 1 parameter, got ${params.length}`)
                }

                return Number(!params[0]!)
            },

            not_expect: (...params: ArgType[]) => {
                if (params.length !== 1) {
                    throw new Error(`Function Exectuion: not_expect. Expected 1 parameter, got ${params.length}`)
                }

                const param = params[0] as ArgType

                if (param === null) {
                    return null
                }

                return Number(!param)
            },

            if: (...params: ArgType[]) => {
                if (params.length === 2) {
                    const [cond, result] = params as [ArgType, ArgType]

                    if (cond) {
                        return result
                    }
                } else if (params.length === 3) {
                    const [cond, result, alt] = params as [ArgType, ArgType, ArgType]

                    if (cond) {
                        return result
                    } else {
                        return alt
                    }
                }

                throw new Error(`Function Exectuion: if. Expected 2 or 3 parameters, got ${params.length}`)
            },

            pick: (...params: ArgType[]) => {
                for (const param of params) {
                    if (param !== null) {
                        return param
                    }
                }

                return null
            },

            ...overrides.fns,
        }
    }
}
