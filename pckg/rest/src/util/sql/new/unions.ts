import * as ksly from "kysely"

export const sql_new_unions = function(src: null | readonly (ksly.RawBuilder<unknown> | null)[]): ksly.RawBuilder<unknown> | null {
    if (src === null) {
        return null
    }

    return src.reduce<ksly.RawBuilder<unknown> | null>(
        (acc, node) => {
            if (node === null) {
                return acc
            }

            if (acc === null) {
                return node
            }

            return ksly.sql`${acc}\nunion\n${node}`
        },
        null
    )
}
