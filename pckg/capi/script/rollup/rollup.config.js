import path from "node:path"
import rollup_json from "@rollup/plugin-json"
import rollup_image from "@rollup/plugin-image"
import rollup_replace from "@rollup/plugin-replace"
import rollup_node from "@rollup/plugin-node-resolve"
import rollup_commonjs from "@rollup/plugin-commonjs"
import rollup_typescript from "@rollup/plugin-typescript"
import * as ts_transform_paths from "typescript-transform-paths"
import { defineConfig } from "rollup";

import * as dotenv from "dotenv"

dotenv.config()

const expect_typeof = function (value, type) {
    if (typeof value !== type) {
        throw new TypeError(`Value is expected to be oftype ${type}`)
    }

    return value
}

export default defineConfig({
    input: path.resolve("./src/index.ts"),

    external: [
        /node_modules/i,
        /fst\/pckg\/(?!capi)/
    ],

    plugins: [
        rollup_node(),
        rollup_commonjs(),

        rollup_replace({
            preventAssignment: true,

            values: {
                "process.env.API_URL": JSON.stringify(expect_typeof(process.env.API_URL, "string"))
            }
        }),

        rollup_typescript({
            declaration: true,
            include: [path.resolve("./src/**"),],
            declarationDir: path.resolve("./build/declaration"),

            transformers: {
                before: [
                    {
                        type: "program",

                        factory: program => {
                            return ts_transform_paths.nxTransformerPlugin.before({}, program)
                        }
                    }
                ],

                afterDeclarations: [
                    {
                        type: "program",

                        factory: program => {
                            return ts_transform_paths.nxTransformerPlugin.afterDeclarations({ afterDeclarations: true }, program)
                        }

                    }
                ]
            }
        }),

        rollup_json(),
        rollup_image(),
    ],

    output: {
        format: "esm",
        dir: path.resolve("./build"),
        entryFileNames: "entry/[name].js",
        chunkFileNames: "chunk/[hash].js",
        assetFileNames: "asset/[hash].[ext].js"
    }
})
