import { defineConfig } from "vite"
import * as path from "node:path"
import * as node_url from "node:url"
import vite_react from "@vitejs/plugin-react"
import vite_tsconfigpaths from "vite-tsconfig-paths"

export default defineConfig({
    root: path.resolve("./src"),

    css: {
        preprocessorOptions: {
            scss: {
                api: "modern-compiler",

                importers: [{
                    findFileUrl(url) {
                        if (!url.startsWith("@")) { return null }

                        return node_url.pathToFileURL(path.resolve(`./src/client/style/${url.substring(1)}`))
                    }
                }]
            }
        }
    },

    plugins: [
        vite_tsconfigpaths(),

        vite_react({
            plugins: ["babel-plugin-react-compiler"]
        }),
    ],

    build: {
        outDir: path.resolve("./build/client/console/"),

        rollupOptions: {
            input: {
                index_console: path.resolve("./src/index_console.html")
            },
        },
    },
})
