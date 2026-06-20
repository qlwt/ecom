import type { TableLocal, TablePublic } from "@src/client"

export type DefServer = {
    table_local: { [K in string]: TableLocal }
    table_public: { [K in string]: TablePublic }
}
