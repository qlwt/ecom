import type { FType } from "@src/client"
import type { TSType } from "@src/tstype/type/tstype"

export const tstype_new_ftype = function(ftype: FType): TSType {
    return {
        stringify: params => {
            let base: string

            switch (ftype.def.kind) {
                case "file": {
                    base = "File"

                    break
                }
                case "record_text": {
                    base = "Record<string, string>"

                    break
                }
                case "union": {
                    const children_tstype = ftype.def.children.map(child => {
                        return tstype_new_ftype(child).stringify({
                            indent: 0,
                        })
                    })

                    base = `(${children_tstype.join(" | ")})`

                    break
                }
                case "uuid":
                case "charset":
                case "text":
                case "formula": {
                    base = "string"

                    break
                }
                case "search": {
                    base = "sxs.Schema"

                    break
                }
                case "int64":
                case "int32":
                case "int16":
                case "float":
                case "double": {
                    base = "number"

                    break
                }
                case "bool": {
                    base = "0 | 1"

                    break
                }
                case "enum-int": {
                    base = ftype.def.name ?? `(${ftype.def.variants.map(v => v.toString()).join(" | ")})`

                    break
                }
                case "enum-string": {
                    base = ftype.def.name ?? `(${ftype.def.variants.map(v => JSON.stringify(v)).join(" | ")})`

                    break
                }
                case "array": {
                    const child = tstype_new_ftype(ftype.def.child).stringify({
                        indent: 0,
                    })

                    base = `(${child})[]`

                    break
                }

                case "tuple": {
                    const children = ftype.def.children.map(child => tstype_new_ftype(child).stringify({
                        indent: 0,
                    }))

                    base = `[${children.join(", ")}]`

                    break
                }
                case "never": {
                    base = "never"

                    break
                }
            }

            if (ftype.status_optional) {
                base = `${base} | null`
            }

            // if (params.status_newline) {
            //     return `\t`.repeat(params.indent) + base
            // }

            return base
        },
    }
}
