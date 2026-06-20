import * as cs from "@fst/config/server"
import * as sxs from "@fst/syntax-search"
import * as z from "zod"

export const zod_ftype = function(ftype: cs.FType): z.ZodType {
    let base: z.ZodType

    switch (ftype.def.kind) {
        case "never":
            base = z.never()

            break
        case "union":
            base = z.union(ftype.def.children.map(child => zod_ftype(child)))

            break
        case "search":
            base = sxs.schema_new()

            break
        case "record_text":
            base = z.record(z.string().max(255), z.string())

            break
        case "file":
            base = z.any()

            break
        case "tuple":
            base = z.tuple(ftype.def.children.map(child => zod_ftype(child)) as [any, ...any])

            break
        case "array":
            base = z.array(zod_ftype(ftype.def.child))

            break
        case "uuid":
            base = z.uuid()

            break
        case "int64":
            base = z.number().int()

            break
        case "int32":
            base = z.int32()

            break
        case "int16":
            base = z.int32()

            break
        case "bool":
            base = z.union([z.literal(0), z.literal(1)])

            break
        case "enum-int":
        case "enum-string":
            base = z.union(ftype.def.variants.map(variant => z.literal(variant)))

            break
        case "charset":
            base = z.string().max(ftype.def.size)

            break
        case "text":
            base = z.string()

            break
        case "formula":
            base = z.string()

            break
        case "float":
            base = z.number()

            break
        case "double":
            base = z.number()

            break
    }

    if (ftype.status_optional) {
        return base.nullable()
    }

    return base
}
