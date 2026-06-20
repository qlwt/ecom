import type * as cs from "@fst/config/server"
import * as rest from "@fst/rest"
import * as ksly from "kysely"

export const dbact_cleanup_deleted = async function(trx: ksly.Transaction<cs.Database>) {
    for (const key of Object.keys(rest.rest) as (keyof cs.Database)[]) {
        await (trx
            .deleteFrom(key)
            .where("deleted", "=", 1)
            .execute()
        )
    }
}
