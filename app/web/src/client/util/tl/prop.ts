import { i18n_fallbacklang } from "@src/client/i18n/init"

export type Lang_Prop_Node_TextFields<TextProp extends string> = {
    readonly [K in TextProp]: string
}

export type Lang_Prop_TlNode = {
    readonly lang: string
    readonly tltable: Record<string, string>
}


export type Lang_Prop_Node_G<TextProp extends string> = (
    & Lang_Prop_Node_TextFields<TextProp>
    & {
        readonly tl: readonly Lang_Prop_TlNode[]
    }
)

export const lang_prop = function <
    TextProp extends string,
    Node extends Lang_Prop_Node_G<TextProp>
>(node: Node, lang: null | string, textprop: TextProp, fallback_notl?: string): string {
    if (lang === null) {
        return node[textprop]
    }

    let fallback_tl: string | null = null

    const tlnodes: readonly Lang_Prop_TlNode[] = node.tl

    for (let i = 0; i < tlnodes.length; ++i) {
        const tlnode = tlnodes[i]!

        if (tlnode.lang === lang) {
            const tltable_prop = tlnode.tltable[textprop]

            if (typeof tltable_prop === "string") {
                return tltable_prop
            }
        } else if (tlnode.lang === i18n_fallbacklang) {
            const tltable_prop = tlnode.tltable[textprop]

            if (typeof tltable_prop === "string") {
                fallback_tl = tltable_prop
            }
        }
    }

    if (typeof fallback_notl === "string") {
        return fallback_notl
    }

    if (typeof fallback_tl === "string") {
        return fallback_tl
    }

    return node[textprop]
}
