type Unit = {
    readonly step: number
    readonly length: number
    readonly name_signle: string
    readonly name_plural: string
}

const units = [
    {
        step: 1e3,
        length: 60,
        name_signle: "second",
        name_plural: "seconds",
    },
    {
        length: 60,
        step: 60 * 1e3,
        name_signle: "minute",
        name_plural: "minutes",
    },
    {
        length: 24,
        step: 60 * 60 * 1e3,
        name_signle: "hour",
        name_plural: "hours",
    },
    {
        length: 31,
        step: 24 * 60 * 60 * 1e3,
        name_signle: "day",
        name_plural: "days"
    },
    {
        length: 12,
        step: 31 * 24 * 60 * 60 * 1e3,
        name_signle: "month",
        name_plural: "months"
    },
    {
        length: Infinity,
        step: 12 * 31 * 24 * 60 * 60 * 1e3,
        name_signle: "year",
        name_plural: "years"
    },
] satisfies readonly Unit[]

export const time_format_ago = function(diff: number): string {
    for (const unit of units) {
        if (diff < unit.step * unit.length) {
            const amount = Math.max(Math.floor(diff / unit.step), 0)

            if (amount <= 1) {
                return `${amount} ${unit.name_signle} ago`
            }

            return `${amount} ${unit.name_plural} ago`
        }
    }

    // unreachable under normal input
    return "Long time ago"
}
