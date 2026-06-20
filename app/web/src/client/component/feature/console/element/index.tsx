import * as asr from "@qyu/atom-state-react"
import { EFCon_NodeKind } from "@src/client/component/feature/console/cst/NodeKind"
import { EFCon_Filter } from "@src/client/component/feature/console/element/filter"
import EFCon_List from "@src/client/component/feature/console/element/list"
import st from "@src/client/component/feature/console/style/index.module.scss"
import type { EFCon_Paginator } from "@src/client/component/feature/console/type/paginator"
import { efcon_paginator_new } from "@src/client/component/feature/console/util/paginator_new"
import { useStateCache } from "@src/client/hook/statecache"
import * as r from "react"

let paginator_last: EFCon_Paginator | null = null

export const EFCon: r.FC = function() {
    const store = asr.useAtomStore()

    const [selection, selection_set] = useStateCache("consolefilter:selection", EFCon_NodeKind.Item)
    const [search, search_set] = useStateCache("consolefilter:search", "")

    const search_default = r.useMemo(() => search, [])

    const [paginator, paginator_set] = r.useState(() => {
        if (paginator_last) {
            return paginator_last
        }

        return paginator_last = efcon_paginator_new(store, selection, search)
    })

    r.useEffect(() => {
        paginator_set(paginator => {
            if (paginator.search.kind !== selection || paginator.search.filter !== search) {
                paginator.cleanup()

                return paginator_last = efcon_paginator_new(store, selection, search)
            }

            return paginator
        })
    }, [selection, search])

    return <main className={st.page}>
        <EFCon_Filter
            selection={selection}
            selection_set={selection_set}

            search_set={search_set}
            search_default={search_default}

            paginator_data={paginator.data}
        />

        <EFCon_List paginator={paginator} />
    </main>
}
