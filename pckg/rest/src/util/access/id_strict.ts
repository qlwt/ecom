import * as cst from "@fst/cst"
import * as eu from "@fst/express-utils"
import { access_id } from "@src/util/access/id"
import * as express from "express"

export const access_id_strict = function(req: express.Request, res: express.Response): string {
    const id = access_id(req, res)

    if (id !== null) {
        return id
    }

    throw eu.error_new_custom(401, cst.ServerError.NoAuth)
}
