import type { TSType } from "@src/tstype/type/tstype";

export type TSType_NewArray_Prop = {
    readonly tstype: TSType
    readonly status_optional: boolean
}

export const tstype_new_array = function(src: TSType): TSType {
    return {
        stringify: params => {
            return `(${src.stringify({ indent: params.indent, })})[]`
        },
    }
}
