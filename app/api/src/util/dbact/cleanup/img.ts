import * as cs from "@fst/config/server"
import { sql_new_fseq_and, sql_new_fseq_or, sql_new_val_list } from "@fst/rest"
import * as ksly from "kysely"
import * as fs from "node:fs/promises"
import * as path from "node:path"

type ImgData = {
    readonly id: string
}

type ImgVariantData = {
    readonly id: string
    readonly fiilename: string
}

export const dbact_cleanup_img = async function(trx: ksly.Transaction<cs.Database>) {
    const refs_dbkey = [...Object.keys(cs.def.table_public), ...Object.keys(cs.def.table_local)].filter(key => {
        return key.endsWith("refimg")
    })

    const condition = sql_new_fseq_or([
        ksly.sql`img.deleted = 1`,

        sql_new_fseq_and(refs_dbkey.map(ref_dbkey => {
            return ksly.sql`
                not exists (
                    select
                        1
                    from ${ksly.sql.raw(ref_dbkey)}
                    where (
                        ${ksly.sql.raw(ref_dbkey)}.img__id = img.id
                        and ${ksly.sql.raw(ref_dbkey)}.deleted = 0
                    )
                )
            `
        })),
    ])

    const imgs_todelete = await (ksly.sql<ImgData>`
        select
            img.id as id
        from img
        where ${condition}
    `.execute(trx))

    if (imgs_todelete.rows.length >= 1) {
        const sqlq_ids = sql_new_val_list(imgs_todelete.rows.map(r => ksly.sql`${r.id}`))

        const variants_todelete = await (ksly.sql<ImgVariantData>`
            select
                img_variant.id as id,
                img_variant.filename as filename
            from img_variant
            where (
                img_variant.img__id in ${sqlq_ids}
            )
        `.execute(trx))

        await (ksly.sql`
            delete from img
            where img.id in ${sqlq_ids}
        `.execute(trx))

        for (const variant of variants_todelete.rows) {
            fs.rm(path.resolve(`./storage/${variant.fiilename}`)).catch(error => {
                console.error(error)
            })
        }
    }
}
