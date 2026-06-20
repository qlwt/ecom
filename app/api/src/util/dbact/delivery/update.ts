import type * as cs from "@fst/config/server"
import { db, zod_json } from "@fst/rest"
import { dbact_delivery_usestream } from "@src/util/dbact/delivery/usestream"
import * as ksly from "kysely"
import https from "node:https"
import zlib from "node:zlib"
import stchain from "stream-chain"
import * as z from "zod"

const schema_versions = function() {
    return zod_json().pipe(z.object({
        base_version: z.object({
            unix_time: z.int(),
            url: z.string(),
        }),

        deltas: z.array(z.object({
            url: z.string(),
            unix_time_from: z.int(),
            unix_time_till: z.int(),
        }))
    }))
}

type Versions_Body = z.infer<ReturnType<typeof schema_versions>>

const timestamp_new = async function(trx: ksly.Transaction<cs.Database>): Promise<number> {
    const timestamp_row = await (trx
        .selectFrom("timestamp_deliveryupdate")
        .selectAll()
        .limit(1)
        .executeTakeFirst()
    )

    if (timestamp_row) {
        return timestamp_row.timestamp_unix
    } else {
        await (trx
            .insertInto("timestamp_deliveryupdate")
            .values({
                id: 0,
                timestamp_unix: 0,
            })
            .execute()
        )
    }

    return 0
}

type UpdateDef = {
    readonly status_clean: boolean
    readonly update_timestamp: number
    readonly urls: readonly string[]
}

const update_new = async function(versions_body: Versions_Body, db_timestamp: number): Promise<UpdateDef> {
    const urls = new Array<string>()

    // db_timestamp after applying all updates in urls
    let timepointer = db_timestamp
    let status_clean = false

    // if database is behind the first delta
    // - load the base_version
    if (versions_body.deltas.length > 0) {
        const delta = versions_body.deltas[0]!

        const delta_from = delta.unix_time_from

        if (delta_from > db_timestamp) {
            urls.push(versions_body.base_version.url)

            status_clean = true
            timepointer = versions_body.base_version.unix_time
        }
    } else {
        const base_version = versions_body.base_version

        const base_version_timestamp = base_version.unix_time

        if (base_version_timestamp > db_timestamp) {
            timepointer = base_version_timestamp
            status_clean = true

            urls.push(versions_body.base_version.url)
        }
    }

    // add all deltas, where database is behind
    for (const delta of versions_body.deltas) {
        const delta_till = delta.unix_time_till

        if (delta_till > timepointer) {
            urls.push(delta.url)

            timepointer = delta_till
        }
    }

    return {
        urls,
        status_clean,
        update_timestamp: timepointer,
    }
}

const url_use = function(url: string) {
    return new Promise(async resolve => {
        https.get(url, {}, res => {
            dbact_delivery_usestream(stchain([
                res,
                zlib.createGunzip({})
            ])).then(resolve)
        })
    })
}

export const dbact_delivery_update = async function() {
    const versions = await fetch(`https://api.novapost.com/divisions/versions`, {
        headers: {
            "Accept-Language": "uk, ru, en",
        },
    })

    const versions_body_raw = await versions.text()
    const versions_body_m = schema_versions().safeParse(versions_body_raw)

    if (versions_body_m.success) {
        const versions_body = versions_body_m.data

        const update = await db.transaction().execute(async trx => {
            const timestamp = await timestamp_new(trx)
            const update = await update_new(versions_body, timestamp)

            if (update.status_clean) {
                await trx.deleteFrom("delivery_division").execute()
            }

            return update
        })

        for (let i = 0; i < update.urls.length; ++i) {
            await url_use(update.urls[i]!)
        }

        await db.transaction().execute(async trx => {
            await (trx
                .updateTable("timestamp_deliveryupdate")
                .where("id", "=", 0)
                .set({
                    timestamp_unix: update.update_timestamp,
                })
                .execute()
            )
        })
    }
}
