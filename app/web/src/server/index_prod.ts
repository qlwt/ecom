import express from "express"
import fs from "node:fs"
import path from "node:path"
import compression from "compression"
import { env_port_console, env_port_public } from "@src/env"

type Server_New_Params = {
    readonly path_html: string
    readonly path_statics: string
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

    app.use(compression({ level: 9 }))
    app.use(express.static(params.path_statics))

    app.use(async (_req, res) => {
        const templatepath = params.path_html

        try {
            const html = fs.readFileSync(templatepath, "utf-8")

            res.status(200).set({ "Content-Type": "text/html" }).end(html)
        } catch (e) {
            res.status(500).end(e instanceof Error ? e.stack : e)
        }
    })

    return app
}

export const domain_pubprod = async function(): Promise<void> {
    const app_public = await server_new({
        path_statics: path.resolve("./build/client/public"),
        path_html: path.resolve("./build/client/public/index_public.html"),

        origins: [`http://localhost:${env_port_public}`]
    })

    const app_console = await server_new({
        path_statics: path.resolve("./build/client/console"),
        path_html: path.resolve("./build/client/console/index_console.html"),

        origins: [`http://localhost:${env_port_console}`]
    })

    app_public.listen(env_port_public, () => {
        console.log(`App Public initialized on port ${env_port_public}`)
    })

    app_console.listen(env_port_console, () => {
        console.log(`App Console initialized on port ${env_port_console}`)
    })
}

domain_pubprod()
