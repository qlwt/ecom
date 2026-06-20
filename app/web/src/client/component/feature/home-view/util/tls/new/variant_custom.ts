import type { RemClone_Variant_Params_Tl } from "@src/client/util/remclone/variant"

export const efhomeview_tls_new_variant_custom = function(): RemClone_Variant_Params_Tl[] {
    return [
        {
            lang: "en",

            tltable: {
                header: "Custom",
                description: "Custom variant created by user",
            },
        },
        {
            lang: "uk",

            tltable: {
                header: "Власний Набiр",
                description: "Набiр створений користувачем",
            },
        },
        {
            lang: "ru",

            tltable: {
                header: "Свой Набор",
                description: "Набор созданный пользователем",
            },
        },
    ]
}
