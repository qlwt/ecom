import * as ksly from "kysely"

export const sql_new_fseq_and = function(src: readonly (ksly.RawBuilder<unknown> | null)[]): ksly.RawBuilder<unknown> | null {
    const reduced = src.reduce<null | ksly.RawBuilder<unknown>>(
        (acc, filter) => {
            if (filter === null) {
                return acc
            }

            if (acc === null) {
                return ksly.sql`(${filter})`
            }

            return ksly.sql`
                ${acc}
                and (${filter})
            `
        },
        null
    )

    if (reduced) {
        return ksly.sql`(
            ${reduced}
        )`
    }

    return null
}
