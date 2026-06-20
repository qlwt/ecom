import * as cst from "@fst/cst"
import { env_jwta_secret } from "@src/env"
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

const access_new = function(params: Access__New_Params): boolean {
    if (params.data.exp >= Date.now()) {
        return false
    }

    try { jwt.verify(params.token, params.secret) } catch (error) {
        return false
    }

    return true
}

export const access_id = function(req: express.Request, res: express.Response): string | null {
    const cookies = schema_cookies().safeParse(req.cookies)

    if (cookies.success) {
        const jwt_access = z.string().safeParse(cookies.data[cst.CookieName.JWTA])

        if (jwt_access.success) {
            const { data: jwt_data } = jwt_schema_data.safeParse(jwt.decode(jwt_access.data))

            const access = jwt_data && access_new({
                data: jwt_data,
                token: jwt_access.data,
                secret: env_jwta_secret,
            })

            if (access) {
                return jwt_data.id
            }
        }

        return null
    }

    return null
}
