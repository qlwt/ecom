import { field_new_str, type Field_NewStr_TypeDef } from "@src/field/new/str";
import type { Field } from "@src/field/type/field";
import type { TableLocal } from "@src/table/type/local";

export type Table_NewLocal_Params = {
    fields: {
        [K in string]: Field | Field_NewStr_TypeDef
    }
}

export const table_new_local = function (params: Table_NewLocal_Params): TableLocal {
    const l_fields: { [K in string]: Field } = {}

    for (const key of Object.keys(params.fields)) {
        const field = params.fields[key]!

        if (typeof field === "string") {
            l_fields[key] = field_new_str(field)
        } else {
            l_fields[key] = field
        }
    }

    return {
        fields: l_fields,
    }
}
