import type { TSType } from "@src/tstype/type/tstype";

export type TSType_NewProp_Config = {
    readonly status_optional?: boolean
}

export const tstype_new_prop = function (src: TSType, config?: TSType_NewProp_Config): TSType_NewObject_Prop {
    return {
        tstype: src,
        status_optional: config?.status_optional ?? false,
    }
}

export type TSType_NewObject_Prop = {
    readonly tstype: TSType
    readonly status_optional: boolean
}

export const tstype_new_object = function(src: { readonly [K in string]: TSType_NewObject_Prop }): TSType {
    return {
        stringify: params => {
            // let result = params.status_newline ? `${`\t`.repeat(params.indent)}{` : `{`
            let result = `{`

            for (const [field_name, field] of Object.entries(src)) {
                const field_str = field.tstype.stringify({ indent: params.indent + 1, })

                result += `\n` + `\t`.repeat(params.indent + 1) + `${field_name}${field.status_optional ? "?:" : ":"} ${field_str},`
            }

            result += `\n` + `\t`.repeat(params.indent) + `}`

            return result
        },
    }
}
