import { db } from "@fst/rest"
import type stream from "node:stream"
import stchain from "stream-chain"
import { parser } from "stream-json"
import { pick } from "stream-json/filters/Pick"
import { streamArray } from "stream-json/streamers/StreamArray"
import { v7 as uuid } from "uuid"
import * as z from "zod"

const schema_refnode = z.object({
    value: z.object({
        id: z.int(),
        externalId: z.string(),

        name: z.string(),
        source: z.string(),
        shortName: z.string(),

        latitude: z.number(),
        longitude: z.number(),

        status: z.string(),
        customerServiceAvailable: z.boolean(),

        divisionCategory: z.string(),
        countryCode: z.string(),

        settlement: z.object({
            id: z.int(),
            name: z.string(),
        }).loose(),

        parent: z.object({
            id: z.int(),
            name: z.string(),
        }),

        address: z.string(),

        addressParts: z.object({
            postCode: z.string(),
            building: z.string(),
            street: z.string(),
            city: z.string(),
            region: z.string(),
        }).loose(),
    }).loose(),
}).loose()

export const dbact_delivery_usestream = async function(stream: stream.Readable): Promise<void> {
    let batch_busy = false
    const batch_stack: (z.infer<typeof schema_refnode>["value"])[][] = []

    const batch_flush = async function() {
        if (batch_busy) { return }

        {
            batch_busy = true
        }

        while (batch_stack.length) {
            const batch_nodes = batch_stack.shift()!

            if (batch_nodes.length === 0) {
                continue
            }

            await db.transaction().execute(async trx => {
                await (trx
                    .insertInto("delivery_division")
                    .values(batch_nodes.map(node => {
                        return {
                            id: uuid(),
                            deleted: 0,
                            creation_date: Date.now(),

                            numid: node.id,
                            externalid: node.externalId,
                            owner: "nova",
                            source: node.source,

                            address: node.address,
                            address_city: node.addressParts.city,
                            address_building: node.addressParts.building,
                            address_postcode: node.addressParts.postCode,
                            address_region: node.addressParts.region,

                            parent_name: node.parent.name,
                            parent_numid: node.parent.id,

                            city_name: node.settlement.name,
                            city_numid: node.settlement.id,

                            country_code: node.countryCode,

                            name_full: node.name,
                            name_short: node.shortName,

                            category: node.divisionCategory,
                            latitude: node.latitude,
                            longitude: node.longitude,

                            status_text: node.status,
                            status_available: Number(node.customerServiceAvailable) as 0 | 1,
                        }
                    })).onConflict(oc => {
                        return oc
                            .column("numid")
                            .doUpdateSet(eb => ({
                                externalid: eb.ref("excluded.externalid"),

                                address: eb.ref(`excluded.address`),
                                address_city: eb.ref(`excluded.address_city`),
                                address_building: eb.ref(`excluded.address_building`),
                                address_postcode: eb.ref(`excluded.address_postcode`),
                                address_region: eb.ref(`excluded.address_region`),

                                parent_name: eb.ref(`excluded.parent_name`),
                                parent_numid: eb.ref(`excluded.parent_numid`),

                                city_name: eb.ref(`excluded.city_name`),
                                city_numid: eb.ref(`excluded.city_numid`),

                                country_code: eb.ref(`excluded.country_code`),

                                name_full: eb.ref("excluded.name_full"),
                                name_short: eb.ref("excluded.name_short"),

                                source: eb.ref("excluded.source"),
                                category: eb.ref(`excluded.category`),

                                latitude: eb.ref(`excluded.latitude`),
                                longitude: eb.ref(`excluded.longitude`),

                                status_text: eb.ref(`excluded.status_text`),
                                status_available: eb.ref(`excluded.status_available`),
                            }))
                    }).execute()
                )
            })
        }

        {
            batch_busy = false
        }
    }

    const process = () => {
        return new Promise<void>(res => {
            let status_firstnode = false
            let counter_tick = 0

            const pipeline = stchain([
                stream,
                parser(),
                pick({ filter: "items" }),
                streamArray(),
            ])

            pipeline.on("data", async refnode => {
                if (++counter_tick >= 5e3) {
                    console.log(`delivery_usestream:process:tick`)

                    counter_tick = 0
                }

                const node_raw = schema_refnode.safeParse(refnode)
                const node = node_raw.data?.value

                if (node && node.countryCode === "UA") {
                    // console.log("node::accepted")

                    status_firstnode = false
                    const batch_last = batch_stack.at(-1)

                    if (!batch_last || status_firstnode) {
                        batch_stack.push([node])
                    } else {
                        if (batch_last.length >= 1e3) {
                            batch_stack.push([node])

                            await batch_flush()
                        } else {
                            batch_last.push(node)
                        }
                    }
                } else {
                    // console.log("node::rejected", refnode, node_raw.error)
                }
            })

            pipeline.on("end", async () => {
                console.log(`delivery_usestream:process:finish`)

                await batch_flush()

                res()
            })
        })
    }

    await process()
}
