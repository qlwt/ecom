import * as capi from "@fst/capi"
import compress, * as compression from "browser-image-compression"

export const compress_filedef = async function(filedef: capi.FileDataDef, options: compression.Options): Promise<capi.FileDataDef> {
    switch (filedef.kind) {
        case "uri":
            return filedef
        case "file":
            return {
                kind: "file",

                data: {
                    file: await compress(filedef.data.file, options),
                }
            }
    }
}
