import * as z from "zod"

export const zod_json = function () {
    return z.string().transform((str, ctx) => {
        try {
            return JSON.parse(str)
        }
        catch (e) {
            ctx.addIssue({
                code: "custom",
                message: "Invalid JSON",
            })

            return z.NEVER
        }
    })
}
