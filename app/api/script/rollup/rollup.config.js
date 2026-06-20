import path from "node:path"
import rollup_json from "@rollup/plugin-json"
import rollup_image from "@rollup/plugin-image"
import rollup_node from "@rollup/plugin-node-resolve"
import rollup_commonjs from "@rollup/plugin-commonjs"
import rollup_typescript from "@rollup/plugin-typescript"
import rollup_workers from "@surma/rollup-plugin-off-main-thread"
import { defineConfig } from "rollup";

export default defineConfig({
    input: {
        index: path.resolve("./src/index.ts"),
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
        rollup_workers(),
    ],

    output: {
        format: "esm",
        dir: path.resolve("./build"),
        entryFileNames: "entry/[name].js",
        chunkFileNames: "chunk/[hash].js",
        assetFileNames: "asset/[hash].[ext].js"
    }
})
