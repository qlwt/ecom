import type { FileDataDef } from "@src/file/type/def";

export const filedef_uri_new = function (filedef: FileDataDef): string {
    switch (filedef.kind) {
        case "uri":
            return filedef.data.uri
        case "file":
            return URL.createObjectURL(filedef.data.file)
    }
}
