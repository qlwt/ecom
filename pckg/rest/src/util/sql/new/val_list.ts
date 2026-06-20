import * as ksly from "kysely"

export const sql_new_val_list = function(src: null | readonly (ksly.RawBuilder<unknown> | null)[]): ksly.RawBuilder<unknown> | null {
    if (!src || src.length === 0) {
        return null
    }

    const reduced = src?.reduce<ksly.RawBuilder<unknown> | null>(
        (acc, node) => {
            if (node === null) {
                return acc
            }

            if (acc === null) {
                return node
            }

            return ksly.sql`${acc}, ${node}`
        },
        null
    )!

    return ksly.sql`(${reduced})`
}
