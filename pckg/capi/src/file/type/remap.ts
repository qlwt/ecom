import type { FileDataDef } from "@src/file/type/def";

export type FileDataRemap<M extends Readonly<Record<string, any[]>>> = {
    readonly [K in keyof M]: readonly FileDataDef[]
}
