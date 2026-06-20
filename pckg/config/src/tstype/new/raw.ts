import type { TSType } from "@src/tstype/type/tstype";

export const tstype_new_raw = function (src: string): TSType {
    return {
        stringify: params => {
            return src
        }
    }
}
