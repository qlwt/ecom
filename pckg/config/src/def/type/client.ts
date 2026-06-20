import type { Join } from "@src/client"

export type DefClient = {
    [K in string]: {
        readonly kind: "data" | "img"
        readonly joins: {
            [K in string]: {
                [K in string]: Join
            }
        }
    }
}
