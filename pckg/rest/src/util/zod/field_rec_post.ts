import * as cs from "@fst/config/server"
import { zod_ftype } from "@src/util/zod/ftype"
import * as z from "zod"

export const zod_field_rec_post = function (fields: Record<string, cs.Field>): z.ZodObject {
    const post_fields: Record<string, z.ZodType> = {}

    for (const [field_key, field] of Object.entries(fields)) {
        if (!(field.status_autogen || field.status_private)) {
            post_fields[field_key] = zod_ftype(field.ftype)
        }
    }

    return z.object(post_fields) 
}
