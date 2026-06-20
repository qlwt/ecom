import * as z from "zod"

export type Schema = (
    | {
        op: "&" | "|"
        children: Schema[]
    }
    | {
        op: "~"
        value: string
    }
    | {
        op: "="
        label: string
        value: string
    }
    | {
        op: "<" | "<=" | ">" | ">="
        label: string
        value: number
    }
)

export const schema_new = function(): z.ZodType<Schema> {
    const node = z.union([
        z.object({
            op: z.union([z.literal("&"), z.literal("|")] as const),

            get children() {
                return node.array().min(1)
            },
        }),

        z.object({
            op: z.union([z.literal("<"), z.literal("<="), z.literal(">"), z.literal(">=")] as const),

            value: z.int(),
            label: z.string().max(255),
        }),

        z.object({
            op: z.union([z.literal("~")] as const),

            value: z.string().max(255),
        }),

        z.object({
            op: z.union([z.literal("=")] as const),

            label: z.string().max(255),
            value: z.string().max(255),
        }),
    ] as const)

    return node
}
