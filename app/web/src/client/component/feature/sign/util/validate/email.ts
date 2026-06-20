import * as z from "zod"

export const efsign__validate_email = (value: string) => {
    value = value.trim()

    return z.email().safeParse(value.trim()).success
}
