import { setup_firebase } from "@/src/setup/firebase"
import * as rest from "@fst/rest"
import { env_client_host, env_console_host, env_port } from "@src/env"
import { schedule_cleanup } from "@src/util/schedule/cleanup"
import { schedule_delivery_update } from "@src/util/schedule/delivery_update"
import express from "express"
import fs from "node:fs/promises"
import path from "node:path"

const storage_init = async function() {
    try {
        await fs.mkdir(path.resolve("./storage"))
    } catch (error) {
    }
}

type Server_New_Params = {
    readonly origins: readonly string[]
}

const server_new = async function(params: Server_New_Params) {
    const app = express()

    app.use((req, res, next) => {
        if (req.headers.origin && params.origins.includes(req.headers.origin)) {
            res.setHeader("Access-Control-Allow-Origin", req.headers.origin)
        }

        res.setHeader("Access-Control-Allow-Methods", "POST, PATCH, DELETE, GET, PUT, HEAD, OPTIONS")
        res.setHeader("Access-Control-Allow-Credentials", "true")
        res.setHeader("Access-Control-Allow-Headers", "Authorization,Content-Type,Access-Control-Allow-Origin")

        next()
    })

    for (const cluster of Object.values(rest.rest)) {
        app.use(rest.cluster_compose(cluster))
    }

    for (const cluster of Object.values(rest.restx)) {
        app.use(rest.cluster_compose(cluster))
    }

    return app
}

const server_init = async function() {
    const app = await server_new({
        origins: [
            env_client_host,
            env_console_host
        ]
    })

    app.listen(env_port, () => {
        console.log(`Api server initialized on port ${env_port}`)
    })
}

const main = async function() {
    await setup_firebase()
    await storage_init()
    await rest.db_define()
    await rest.db_adjust()

    schedule_cleanup()
    schedule_delivery_update()

    await server_init()
}

main()
