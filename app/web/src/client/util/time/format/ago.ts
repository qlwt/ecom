import type * as i18 from "i18next"

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
    } as const,
    {
        length: 60,
        step: 60 * 1e3,
        name_signle: "minute",
        name_plural: "minutes",
    } as const,
    {
        length: 24,
        step: 60 * 60 * 1e3,
        name_signle: "hour",
        name_plural: "hours",
    } as const,
    {
        length: 31,
        step: 24 * 60 * 60 * 1e3,
        name_signle: "day",
        name_plural: "days"
    } as const,
    {
        length: 12,
        step: 31 * 24 * 60 * 60 * 1e3,
        name_signle: "month",
        name_plural: "months"
    } as const,
    {
        length: Infinity,
        step: 12 * 31 * 24 * 60 * 60 * 1e3,
        name_signle: "year",
        name_plural: "years"
    } as const,
] satisfies readonly Unit[]

export const time_format_ago = function(diff: number, t: typeof i18.t): string {
    for (const unit of units) {
        if (diff < unit.step * unit.length) {
            const amount = Math.max(Math.floor(diff / unit.step), 0)

            return `${t(`time.${unit.name_signle}`, { count: amount })} ${t("time.ago")}`
        }
    }

    // unreachable under normal input
    return t("time.longtime")
}
