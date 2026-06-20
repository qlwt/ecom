import type { Field } from "@src/field/type/field"

export type TableLocal = {
    fields: { [K in string]: Field }
}
