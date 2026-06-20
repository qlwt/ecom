import path from "node:path"
import rollup_json from "@rollup/plugin-json"
import rollup_image from "@rollup/plugin-image"
import rollup_node from "@rollup/plugin-node-resolve"
import rollup_commonjs from "@rollup/plugin-commonjs"
import rollup_typescript from "@rollup/plugin-typescript"
import { defineConfig } from "rollup";

export default defineConfig({
    input: {
        index_dev: path.resolve("./src/server/index_dev.ts"),
        index_prod: path.resolve("./src/server/index_prod.ts"),
    },

    external: [
        /node_modules/i
    ],

    plugins: [
        rollup_node(),
        rollup_commonjs(),

        rollup_typescript({
            include: [
                path.resolve("./src/**"),
            ]
        }),

        rollup_json(),
        rollup_image(),
    ],

    output: {
        format: "esm",
        dir: path.resolve("./build/server"),
        entryFileNames: "entry/[name].js",
        chunkFileNames: "chunk/[hash].js",
        assetFileNames: "asset/[hash].[ext].js"
    }
})
