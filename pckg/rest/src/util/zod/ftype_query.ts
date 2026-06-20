import * as cs from "@fst/config/server"
import { object_new_map } from "@src/util/object/new/map"
import { zod_ftype } from "@src/util/zod/ftype"
import { zod_json } from "@src/util/zod/json"
import * as z from "zod"

export const zod_ftype_query = function(src: Record<string, cs.FType>): z.ZodObject {
    return z.object(object_new_map(src, ftype => zod_json().pipe(zod_ftype(ftype))))
}
