import * as cs from "@fst/config/server"

export type Database_Slice = {
    [K in keyof cs.DatabasePublic]: {
        nodes: cs.DatabasePublic[K][]
        status_indexed: boolean
    } | null
}
