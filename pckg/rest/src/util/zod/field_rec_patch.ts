import * as cs from "@fst/config/server"
import { zod_ftype } from "@src/util/zod/ftype"
import * as z from "zod"

export const zod_field_rec_patch = function (fields: Record<string, cs.Field>): z.ZodObject {
    const patch_fields: Record<string, z.ZodType> = {}

    for (const [field_key, field] of Object.entries(fields)) {
        if (!(field.status_static || field.status_private || field.status_primary)) {
            patch_fields[field_key] = zod_ftype(field.ftype).exactOptional()
        }
    }

    return z.object(patch_fields) 
}
