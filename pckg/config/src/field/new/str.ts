import type { Field, Field_Relation } from "@src/field/type/field";
import { ftype_new } from "@src/ftype/new";
import type { FType_Def } from "@src/ftype/type/ftype";

type Field_NewStr_TypeDefModifier = (
    `${" static" | ""}${" unique" | ""}${" private" | ""}${" indexed" | ""}${" primary" | ""}${" autogen" | ""}${` $${string}->${string}` | ""}`
)

export type Field_NewStr_TypeDef = (
    `${"?" | ""}${FType_Def["kind"]}${Field_NewStr_TypeDefModifier}`
)

export const field_new_str = function(ftype: Field_NewStr_TypeDef): Field {
    const sections = ftype.split(" ")

    let status_static = false
    let status_private = false
    let status_indexed = false
    let status_primary = false
    let status_autogen = false
    let status_unique = false
    let relation: Field_Relation | null = null

    for (let i = 1; i < sections.length; ++i) {
        const section = sections[i]!

        if (section.startsWith("$")) {
            const [table, field] = section.slice(1).split("->") as [string, string]

            relation = { table, field }
        } else {
            switch (section) {
                case "autogen":
                    status_autogen = true

                    break
                case "unique":
                    status_unique = true

                    break
                case "static":
                    status_static = true

                    break
                case "private":
                    status_private = true

                    break
                case "indexed":
                    status_indexed = true

                    break
                case "primary":
                    status_primary = true

                    break
            }
        }
    }

    const def = sections[0]!
    const status_optional = def.startsWith("?")

    return {
        ftype: ftype_new(
            (status_optional ? def.slice(1) : def) as FType_Def["kind"],
            { status_optional, }
        ),

        relation,
        status_unique,
        status_autogen,
        status_static,
        status_primary,
        status_indexed,
        status_private,
    }
}
