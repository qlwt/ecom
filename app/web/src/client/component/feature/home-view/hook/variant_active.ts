import * as gs from "@fst/gstate"
import { EFHomeView_Selection_ActName, EFHomeView_Selection_Kind, type EFHomeView_Selection } from "@src/client/component/feature/home-view/type/selection"
import type { FnSetterStateles } from "@src/client/type/fns"
import * as r from "react"
import * as rr from "react-router"

type Data_Item = gs.Rem_JoinData<"item">
type Data_Variant = gs.Rem_JoinData<"variant">

export const useFHomeView_VariantActive = function(node: Data_Item): [EFHomeView_Selection, FnSetterStateles<EFHomeView_Selection>, Data_Variant | null] {
    const [urlsearch, urlsearch_set] = rr.useSearchParams()
    const ref_lastcheck = r.useRef<null | number>(null)

    const [selection, selection_set] = r.useState<EFHomeView_Selection>(() => {
        const id = urlsearch.get("variant")

        if (typeof id !== "string") {
            return {
                kind: EFHomeView_Selection_Kind.Act,
                name: EFHomeView_Selection_ActName.NewCustom,
            }
        }

        return {
            kind: EFHomeView_Selection_Kind.Selection,
            id,
        }
    })

    const variant_active = r.useMemo(() => {
        if (selection.kind !== EFHomeView_Selection_Kind.Selection) {
            return null
        }

        if (selection.id === null) {
            return node.variants[0] ?? null
        }

        if (ref_lastcheck.current !== null) {
            const variant = node.variants[ref_lastcheck.current]

            if (variant && variant.id === selection.id) {
                return variant
            }
        }

        for (let i = 0; i < node.variants.length; ++i) {
            const variant = node.variants[i]!

            if (variant.id === selection.id) {
                return variant
            }
        }

        return null
    }, [node.variants, selection])

    return [
        selection,
        now_selection => {
            selection_set(now_selection)

            urlsearch_set(old_urlsearch => {
                switch (now_selection.kind) {
                    case EFHomeView_Selection_Kind.Act: {
                        old_urlsearch.delete("variant")

                        break
                    }
                    case EFHomeView_Selection_Kind.Selection: {
                        if (typeof now_selection.id === "string") {
                            old_urlsearch.set("variant", now_selection.id)
                        } else {
                            old_urlsearch.delete("variant")
                        }

                        break
                    }
                }

                return old_urlsearch
            }, {
                replace: true
            })
        },
        variant_active
    ]
}
