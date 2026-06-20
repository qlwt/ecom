import "dotenv"

import { env_port_console, env_port_public } from "@src/env"
import vite_react from "@vitejs/plugin-react"
import express from "express"
import fs from "node:fs"
import path from "node:path"
import node_url from "node:url"
import * as vite from "vite"
import vite_tsconfigpaths from "vite-tsconfig-paths"

type Server_New_Params = {
    readonly vite_hmr_port: number
    readonly filename: string
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

    // web frontend things
    {
        const viteserver = await vite.createServer({
            appType: "custom",
            root: path.resolve("./src"),

            css: {
                preprocessorOptions: {
                    scss: {
                        importers: [{
                            findFileUrl(url: string) {
                                if (!url.startsWith("@")) { return null }

                                return node_url.pathToFileURL(path.resolve(`./src/client/style/${url.substring(1)}`))
                            }
                        }]
                    }
                }
            },

            server: {
                middlewareMode: true,
                allowedHosts: ["katydid-free-oddly.ngrok-free.app"],

                hmr: {
                    port: params.vite_hmr_port,
                },

                watch: {
                    usePolling: true,
                },
            },

            plugins: [
                vite_tsconfigpaths(),

                vite_react({
                    babel: {
                        plugins: ["babel-plugin-react-compiler"]
                    }
                }),
            ]
        })

        app.use(viteserver.middlewares)

        app.use(async (req, res) => {
            const url = req.originalUrl
            const templatepath = path.resolve(`./src/${params.filename}`)

            try {
                const template = fs.readFileSync(templatepath, "utf-8")
                const html = await viteserver.transformIndexHtml(url, template)

                res.status(200).set({ "Content-Type": "text/html" }).end(html)
            } catch (e) {
                res.status(500).end(e instanceof Error ? e.stack : e)
            }
        })

        app.use("/assets", express.static(path.resolve("./src/assets")))
    }

    return app
}

const serve = async function() {
    const app_public = await server_new({
        vite_hmr_port: 4100,
        filename: "index_public.html",
        origins: [`http://localhost:${env_port_public}`],
    })

    const app_console = await server_new({
        vite_hmr_port: 4101,
        filename: "index_console.html",
        origins: [`http://localhost:${env_port_console}`],
    })

    app_public.listen(env_port_public, () => {
        console.log(`App Public initialized on port ${env_port_public}`)
    })

    app_console.listen(env_port_console, () => {
        console.log(`App Console initialized on port ${env_port_console}`)
    })
}

{
    serve()
}
