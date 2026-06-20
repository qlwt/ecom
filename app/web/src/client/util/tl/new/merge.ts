export type TL_NewMerge_Def = {
    readonly lang: string
    readonly tltable: Record<string, string>
}

export const tl_new_merge = function (src: readonly (readonly TL_NewMerge_Def[])[]): TL_NewMerge_Def[] {
    const map_tltable = new Map<string, Record<string, string>>()

    for (const tls of src) {
        for (const tl of tls) {
            let result_tltable = map_tltable.get(tl.lang)

            if (typeof result_tltable !== "object") {
                result_tltable = {}

                map_tltable.set(tl.lang, result_tltable)
            }

            Object.assign(result_tltable, tl.tltable)
        }
    }

    return [...map_tltable.entries()].map(([lang, tltable]) => {
        return {
            lang,
            tltable,
        }
    })
}
