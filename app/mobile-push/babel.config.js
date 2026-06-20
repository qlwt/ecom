const tspaths = require("tsconfig-paths")

const config = tspaths.loadConfig()

const alias_new = function() {
    const alias = {}

    if (config.resultType === "success") {
        for (const key of Object.keys(config.paths)) {
            const key_path = config.paths[key][0]

            alias[key.replace("/*", "")] = key_path.replace("/*", "")
        }
    }

    return alias
}

module.exports = {
    presets: ["module:@react-native/babel-preset"],

    plugins: [
        [
            "react-compiler",
        ],
        [
            "@babel/plugin-transform-export-namespace-from",
        ],
        [
            "module-resolver",
            {
                root: "./",
                alias: alias_new(),
                extensions: [".js", ".jsx", ".ts", ".tsx"],
            }
        ],
    ]
}
