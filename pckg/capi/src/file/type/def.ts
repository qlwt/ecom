export type FileDataDef_URI = Readonly<{
    kind: "uri",

    data: Readonly<{
        uri: string
        name: string
        mimetype: string
    }>
}>

export type FileDataDef_File = Readonly<{
    kind: "file"

    data: Readonly<{
        file: File
    }>
}>

export type FileDataDef = (
    | FileDataDef_URI
    | FileDataDef_File
)
