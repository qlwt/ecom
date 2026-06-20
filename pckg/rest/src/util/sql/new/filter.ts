import { sql_new_fseq_and } from "@src/util/sql/new/fseq_and"
import * as ksly from "kysely"

export const sql_new_filter = function(src: readonly (ksly.RawBuilder<unknown> | null)[]): ksly.RawBuilder<unknown> {
     src.reduce<null | ksly.RawBuilder<unknown>>(
        (acc, filter) => {
            if (filter === null) {
                return acc
            }

            if (acc === null) {
                return ksly.sql`where (
                    ${filter}
                )`
            }

            return ksly.sql`
                ${acc}
                and (
                    ${filter}
                )
            `
        },
        null
    ) ?? ksly.sql``

    const fseq = sql_new_fseq_and(src)

    if (fseq !== null) {
        return ksly.sql`where ${fseq}`
    }

    return ksly.sql``
}
