import * as cs from "@fst/config/server"
import { object_new_map } from "@src/util/object/new/map"
import { zod_ftype } from "@src/util/zod/ftype"
import * as z from "zod"

export const zod_ftype_rec = function (src: Record<string, cs.FType>): z.ZodObject {
    return z.object(object_new_map(src, zod_ftype))
}
