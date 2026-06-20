import * as cst from "@fst/cst"
import * as eu from "@fst/express-utils"
import { access_acc_strict } from "@src/util/access/acc_strict"
import type { Cluster_Route } from "@src/util/cluster/type/cluster"
import { db } from "@src/db/init"
import frba from "firebase-admin"
import * as ksly from "kysely"
import { v7 as uuid } from "uuid"
import * as z from "zod"

const cmethod_name_new = function(cmethod: cst.PingMe_ContactMethod): string {
    switch (cmethod) {
        case cst.PingMe_ContactMethod.Phone:
            return "phone"
        case cst.PingMe_ContactMethod.Viber:
            return "viber"
        case cst.PingMe_ContactMethod.Telegram:
            return "telegram"
    }
}

export type RestX_PingRouteNewPush_Params = {
}

export const restx_ping_route_new_push = function(params: RestX_PingRouteNewPush_Params) {
    const schema_body = z.object({
        acc_id: z.uuid(),
        phone: z.string().max(255),
        cmethod: z.enum(cst.PingMe_ContactMethod),
    })

    return {
        schema: {
            body: schema_body
        },

        handler: eu.route_new_path({
            method: "post",
            path: `/restx/ping/push`,

            middleware: [
                eu.middleware_new_cookie(),
                eu.middleware_new_json_short(),

                eu.middleware_new_ratelimit({
                    limit: 10,
                    subnet: 56,
                    window: 1e3 * 60 * 60,

                    skip_new: async (req, res) => {
                        const acc = await access_acc_strict(req, res)

                        return acc.access >= cst.AccountAccess.Moderator
                    },
                })
            ],

            handler: async ctx => {
                const { req, res } = ctx

                const body = eu.input_parse_zod(schema_body, req.body)
                const creation_date = Date.now()

                await db.transaction().execute(async trx => {
                    const timecheck = await ksly.sql<{ repeats: number }>`
                        select
                            count(*) as repeats
                        from ping_msg
                        where (
                            ping_msg.owner = ${body.acc_id}
                            and ping_msg.phone = ${body.phone}
                            and ping_msg.status_checked = 0
                            and ping_msg.cmethod = ${body.cmethod}
                            and ping_msg.creation_date >= ${creation_date - 20 * 60 * 1e3}
                        )
                        limit 1
                    `.execute(trx)

                    if (timecheck.rows[0] && timecheck.rows[0].repeats >= 1) {
                        const acc = await access_acc_strict(req, res)

                        if (acc.access < cst.AccountAccess.Moderator) {
                            throw eu.error_new_custom(403, cst.ServerError.AlreadyPending)
                        }
                    }

                    {
                        (await trx
                            .updateTable("ping_msg")
                            .where("owner", "=", body.acc_id)
                            .set({
                                status_checked: 1,
                            })
                            .execute()
                        )
                    }

                    await (trx
                        .insertInto("ping_msg")
                        .values({
                            id: uuid(),
                            deleted: 0,
                            creation_date,

                            status_checked: 0,
                            phone: body.phone,
                            owner: body.acc_id,
                            cmethod: body.cmethod,
                        })
                        .execute()
                    )

                    {
                        const listeners = await (trx
                            .selectFrom("ping_device")
                            .select(["token"])
                            .execute()
                        )

                        const phone = (
                            `+38 (${body.phone.slice(0, 3)})`
                            + ` ${body.phone.slice(3, 6)}`
                            + ` ${body.phone.slice(6, 8)}`
                            + ` ${body.phone.slice(8, 10)}`
                        )

                        if (listeners.length >= 1) {
                            frba.messaging().sendEachForMulticast({
                                tokens: listeners.map(n => n.token),

                                notification: {
                                    title: "Ping Me Back",
                                    body: `Ping phone ${phone} on ${cmethod_name_new(body.cmethod)}`,
                                },

                                android: {
                                    priority: "high",
                                },
                            })
                        }
                    }
                })

                return eu.response_new_json({
                    body: null,
                    status: 200,
                })
            },
        }),
    } satisfies Cluster_Route
}
