export type ReduceConfig = {
    readonly vars: {
        readonly [K in string]: number | null
    }

    readonly fns: {
        readonly [K in string]: (...args: (number | null)[]) => number | null
    }
}
