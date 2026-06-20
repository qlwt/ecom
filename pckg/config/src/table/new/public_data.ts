import { field_new_str } from "@src/field/new/str";
import { join_new_str } from "@src/join/new/str";
import type { Join } from "@src/join/type/join";
import { rest_new_data } from "@src/rest/new/data";
import type { RestDefData } from "@src/rest/type/data";
import type { Table_Field, Table_FieldInput, Table_Join, Table_JoinInput, TablePublicData } from "@src/table/type/public";

export type Table_NewPublicData_Params = {
    rest?: RestDefData
    joins?: Table_JoinInput
    fields: Table_FieldInput
}

export const table_new_public_data = function(params: Table_NewPublicData_Params): TablePublicData {
    const l_fields: Table_Field = {}
    const l_joins: Table_Join = { core: {} }

    for (const key of Object.keys(params.fields)) {
        const field = params.fields[key]!

        if (typeof field === "string") {
            l_fields[key] = field_new_str(field)
        } else {
            l_fields[key] = field
        }
    }

    if (params.joins) {
        for (const variant_key of Object.keys(params.joins)) {
            const l_variant: { [K in string]: Join } = {}
            const param_variant = params.joins[variant_key]!

            l_joins[variant_key] = l_variant

            for (const key of Object.keys(param_variant)) {
                const param_join = param_variant[key]!

                if (typeof param_join === "string") {
                    l_variant[key] = join_new_str(param_join)
                } else {
                    l_variant[key] = param_join
                }
            }
        }
    }

    return {
        kind: "data",
        joins: l_joins,
        fields: l_fields,
        rest: params.rest ?? rest_new_data(),
    }
}
