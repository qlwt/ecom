import * as cst from "@fst/cst"
import { gv, rem } from "@fst/gstate"
import * as asr from "@qyu/atom-state-react"
import st from "@src/client/component/feature/tracker/style/page.module.scss"
import { EPInText_IconBtn } from "@src/client/component/primitive/in-text/element/icon_btn"
import EPInText_Input from "@src/client/component/primitive/in-text/element/input"
import EPInText_ViewWeak from "@src/client/component/primitive/in-text/element/view_weak"
import st_intext from "@src/client/component/primitive/in-text/style/white.module.scss"
import { urlmap } from "@src/client/urlmap"
import { icon_new } from "@src/client/util/icon/new"
import cl from "classnames"
import * as r from "react"
import * as ri18 from "react-i18next"
import * as rr from "react-router"

export type EFTracker__Page_Props = {
}

export const EFTracker_Page: r.FC<EFTracker__Page_Props> = props => {
    const { t } = ri18.useTranslation()

    const navigate = rr.useNavigate()
    const dispatch = asr.useAtomDispatch()

    const [search, search_set] = r.useState("")
    const search_parsed = search.replace(/\D+/g, "")
    const [pending, pending_set] = r.useState(false)

    return <main className={st.page}>
        <div className={st.container}>
            <EPInText_ViewWeak
                value={search}
                stmod={st_intext}
                state_disabled={pending}
                className={cl(st.intext)}
            >
                <EPInText_Input
                    mask={`0000-0000-0000-0000`}
                    event_value_change={search_set}
                    placeholder={`0000-0000-0000-0000`}

                    event_submit={() => {
                        if (search_parsed.length >= 16) {

                        }
                    }}
                />

                <EPInText_IconBtn
                    style_highlight

                    status_pending={pending}
                    status_disabled={search_parsed.length < 16}

                    icon={icon_new("arrow-right")}

                    event_click={() => {
                        pending_set(true)

                        dispatch(rem.commision.act.get({
                            query: {
                                limit: 1,
                                cursor: null,
                                include_hidden: 1,
                                id_public: search_parsed,

                                search: null,
                                pick_owner: null,
                            },

                            config: {
                                events: {
                                    success: data => {
                                        const commision = data.slice.commision?.nodes?.[0]

                                        if (commision) {
                                            const base = urlmap.shared.commision_view({ id: commision.id })
                                            const id_public = encodeURIComponent(search_parsed)

                                            navigate(`${base}?id_public=${id_public}`)
                                        } else {
                                            dispatch(gv.report.act.push_error({
                                                text: t(`popups.error.track_notfound`)
                                            }))
                                        }
                                    },

                                    failure: reason => {
                                        switch (reason) {
                                            case cst.ServerError.NotFound: {
                                                dispatch(gv.report.act.push_error({
                                                    text: t(`popups.error.track_notfound`)
                                                }))

                                                break
                                            }
                                            default:
                                                dispatch(gv.report.act.push_error({
                                                    text: t(`popups.error.track_default`)
                                                }))

                                                break
                                        }
                                    },

                                    cleanup: () => {
                                        pending_set(false)
                                    },
                                },
                            },
                        }))
                    }}
                />
            </EPInText_ViewWeak>
        </div>
    </main>
}

export default EFTracker_Page
