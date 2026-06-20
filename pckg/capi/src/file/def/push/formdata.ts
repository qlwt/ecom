import type { FileDataDef } from "@src/file/type/def";

export const filedef_push_formdata = function(formdata: FormData, formdata_key: string, filedef: FileDataDef) {
    switch (filedef.kind) {
        case "uri": {
            // works in mobile
            formdata.append(formdata_key, {
                uri: filedef.data.uri,
                name: filedef.data.name,
                type: filedef.data.mimetype,
            } as any)

            break
        }
        case "file": {
            formdata.append(formdata_key, filedef.data.file)

            break
        }
    }
}
