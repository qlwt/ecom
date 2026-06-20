import * as cs from "@fst/config/server"
import * as cst from "@fst/cst"
import * as eu from "@fst/express-utils"
import { access_acc } from "@src/util/access/acc"
import * as express from "express"

export const access_acc_strict = async function(req: express.Request, res: express.Response): Promise<cs.Database["acc"]> {
    const acc = await access_acc(req, res)

    if (acc) {
        return acc
    }

    throw eu.error_new_custom(401, cst.ServerError.NoAuth)
}
