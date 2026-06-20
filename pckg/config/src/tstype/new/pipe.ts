import type { TSType } from "@src/tstype/type/tstype";

export const tstype_new_raw = function (src: TSType, transformer: (src_str: string) => string): TSType {
    return {
        stringify: params => {
            return transformer(src.stringify(params))
        }
    }
}
