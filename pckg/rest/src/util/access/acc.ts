import * as cs from "@fst/config/server"
import * as cst from "@fst/cst"
import { env_jwta_secret } from "@src/env"
import { db } from "@src/db/init"
import { jwt_schema_data } from "@src/util/jwt/schema/data"
import * as express from "express"
import * as jwt from "jsonwebtoken"
import * as z from "zod"

const schema_cookies = function() {
    return z.object({
        [cst.CookieName.JWTA]: z.string().optional(),
    })
}

type Access__New_Params = {
    readonly token: string
    readonly secret: string
    readonly data: z.infer<typeof jwt_schema_data>
}

const access_status = function(params: Access__New_Params): boolean {
    if (params.data.exp >= Date.now()) {
        return false
    }

    try { jwt.verify(params.token, params.secret) } catch (error) {
        return false
    }

    return true
}

export const access_acc = async function(req: express.Request, res: express.Response): Promise<cs.Database["acc"] | null> {
    const cookies = schema_cookies().safeParse(req.signedCookies)

    if (!cookies.success) { return null }

    const jwt_access = z.string().safeParse(cookies.data[cst.CookieName.JWTA])

    if (!jwt_access.success) { return null }

    const trx_acc = await db.transaction().execute(async trx => {
        const { data: jwt_data } = jwt_schema_data.safeParse(jwt.decode(jwt_access.data))

        const status_access = jwt_data && access_status({
            data: jwt_data,
            token: jwt_access.data,
            secret: env_jwta_secret,
        })

        if (status_access) {
            const acc = await (trx
                .selectFrom("acc")
                .selectAll()
                .where("id", "=", jwt_data.id)
                .where("deleted", "=", 0)
                .executeTakeFirst()
            )

            return acc ?? null
        }

        return null
    })

    return trx_acc
}
