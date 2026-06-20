import * as eu from "@fst/express-utils"
import type { Cluster } from "@src/util/cluster/type/cluster"
import * as express from "express"

export const cluster_compose = function (router: Cluster): express.Router {
    const exprouter = express.Router()

    for (const routedef of Object.values(router.routes)) {
        eu.route_use(routedef.handler, exprouter)
    }

    return exprouter
}
