import * as cst from "@fst/cst"
import { error_new_custom } from "@src/error/new/custom"
import * as z from "zod"

export function input_parse_zod<T>(schema: z.ZodType<T>, value: unknown): T {
    const parsed = schema.safeParse(value)

    if (!parsed.success) {
        throw error_new_custom(400, cst.ServerError.BadReq)
    }

    return parsed.data
}

export function input_parse_fn<T>(schema: (p: any) => T, value: unknown): T {
    try {
        const parsed = schema(value)

        return parsed
    } catch (E) {
        throw error_new_custom(400, cst.ServerError.BadReq)
    }
}
