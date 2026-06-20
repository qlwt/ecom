import type { FType, FType_Def } from "@src/ftype/type/ftype";

const def_new = function(def_raw: FType_Def | FType_Def["kind"]): FType_Def {
    if (typeof def_raw === "object") {
        return def_raw
    }

    switch (def_raw) {
        case "enum-string":
        case "enum-int":
            return {
                kind: def_raw,
                name: "",
                variants: [],
            }
        case "charset":
            return {
                kind: def_raw,
                size: 255,
            }
        case "array":
            return {
                kind: def_raw,
                child: ftype_new({ kind: "never", }),
            }
        case "tuple":
            return {
                kind: def_raw,
                children: []
            }
        case "file": {
            return {
                kind: def_raw,
                mimetype: "",
                size: 1 << 20,
            }
        }
        case "union": {
            return {
                kind: def_raw,
                children: [],
            }
        }
    }

    return {
        kind: def_raw
    }
}

export type FType_New_Config = {
    readonly status_optional?: boolean
}

export const ftype_new = function(def_raw: FType_Def | FType_Def["kind"], config?: FType_New_Config): FType {
    return {
        def: def_new(def_raw),
        status_optional: config?.status_optional ?? false,
    }
}
