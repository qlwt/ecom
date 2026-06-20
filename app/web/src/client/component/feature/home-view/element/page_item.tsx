import st from "@client/component/feature/home-view/style/page_item.module.scss"
import * as gs from "@fst/gstate"
import { rem } from "@fst/gstate"
import * as asc from "@qyu/atom-state-core"
import * as asr from "@qyu/atom-state-react"
import * as rfl from "@qyu/reactcmp-flow-control"
import * as sc from "@qyu/signal-core"
import ELHomeView_SecImg from "@src/client/component/feature/home-view/local/sec_img"
import ELHomeView_SecVariant from "@src/client/component/feature/home-view/local/sec_variant"
import EFStatusPage_NotFound from "@src/client/component/feature/status-page/element/page_notfound"
import EFStatusPage_Pending from "@src/client/component/feature/status-page/element/page_pending"
import { useAuthAcc } from "@src/client/hook/auth/acc"
import cl from "classnames"
import * as r from "react"
import * as rr from "react-router"

const useLoad = function(item_id: string, acc_id: string | null) {
    const loader = asr.useAtomChild({
        atomfamily: rem.item.loaders.get_id,

        params: r.useMemo(() => ({
            id: item_id,
            include_hidden: 0 as const,
            pick_owner: typeof acc_id === "string" ? ["null-public", acc_id] : ["null-public"],

            search: null,
            filter_tag__id: null,
            pick_tmplit__id: null,
        }), [item_id, acc_id])
    })

    r.useEffect(() => {
        const cleanup = loader.request()

        return () => {
            cleanup()
        }
    }, [loader])
}

type UseItem_Meta = {
    readonly status_pending: boolean
    readonly status_loadgrace: boolean
}

const useItem = function(id: string): [gs.Rem_JoinData<"item"> | null, UseItem_Meta] {
    const acc = useAuthAcc()

    const [status_loadgrace, status_loadgrace_set] = r.useState(true)

    const item_status_pending = asr.useAtomOutput(r.useCallback(
        ({ reg }) => sc.osignal_new_pipe(
            reg(rem.item.register).reg({ id }).real,
            real => real.status === asc.ReqState__Status.Pending
        ),
        [id]
    ), Object.is)

    const item_join = asr.useAtomOutput(r.useCallback(
        ({ reg }) => reg(rem.item.joins.core())({ id }),
        [id]
    ))

    useLoad(id, acc?.id ?? null)

    r.useEffect(() => {
        if (status_loadgrace === false) {
            status_loadgrace_set(true)
        }

        const timer_id = setTimeout(() => {
            status_loadgrace_set(false)
        }, 1e3)

        return () => {
            clearTimeout(timer_id)
        }
    }, [id])

    return [
        r.useMemo(() => {
            const data = item_join?.data

            if (data && data.deleted !== 1) {
                return data
            }

            return null
        }, [item_join?.data]),
        r.useMemo(() => {
            return {
                status_pending: item_status_pending,
                status_loadgrace: status_loadgrace,
            }
        }, [item_status_pending, status_loadgrace])
    ]
}

export type EFHomeView__PageItem_Props = {

}

export const EFHomeView__PageItem: r.FC<EFHomeView__PageItem_Props> = props => {
    const urlquery = rr.useParams()
    const urlquery_id = urlquery.id ?? ""

    const [item, item_meta] = useItem(urlquery_id)

    if (item) {
        return <main className={st.page}>
            <rfl.CmpIf value={item.refimgs.length > 0}>
                {() => <div className={cl(st.sector, st.sector_block)}>
                    <ELHomeView_SecImg node={item} />
                </div>}
            </rfl.CmpIf>

            <div className={cl(st.sector, st.sector_block)}>
                <ELHomeView_SecVariant node={item} />
            </div>
        </main>
    } else {
        if (item_meta.status_pending || item_meta.status_loadgrace) {
            return <EFStatusPage_Pending />
        }

        return <EFStatusPage_NotFound />
    }
}

export default EFHomeView__PageItem
