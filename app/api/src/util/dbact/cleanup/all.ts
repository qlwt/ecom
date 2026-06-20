import { db } from "@fst/rest"
import { dbact_cleanup_deleted } from "@src/util/dbact/cleanup/deleted"
import { dbact_cleanup_img } from "@src/util/dbact/cleanup/img"

export const dbact_cleanup_all = async function () {
    await db.transaction().execute(async trx => {
        await dbact_cleanup_img(trx)
        await dbact_cleanup_deleted(trx)
    })
}
