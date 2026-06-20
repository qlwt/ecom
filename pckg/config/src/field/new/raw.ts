import type { Field, Field_Relation } from "@src/field/type/field";
import type { FType } from "@src/ftype/type/ftype";

export type Field_NewRaw_Config = {
    readonly status_static?: boolean
    readonly status_indexed?: boolean
    readonly status_private?: boolean
    readonly status_primary?: boolean
    readonly status_autogen?: boolean
    readonly status_unique?: boolean
    readonly relation?: Field_Relation | null
}

export const field_new_raw = function(ftype: FType, config: Field_NewRaw_Config) {
    return {
        ftype,

        relation: config.relation ?? null,
        status_static: config.status_static ?? false,
        status_unique: config.status_unique ?? false,
        status_indexed: config.status_indexed ?? false,
        status_private: config.status_private ?? false,
        status_primary: config.status_primary ?? false,
        status_autogen: config.status_autogen ?? false,
    } satisfies Field
}
