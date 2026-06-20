import * as capi from "@fst/capi"
import * as cc from "@fst/config/client"
import * as cst from "@fst/cst"
import * as dbdef from "@fst/db-default"
import * as gs from "@fst/gstate"
import { rem } from "@fst/gstate"
import * as sxm from "@fst/syntax-math"
import * as asc from "@qyu/atom-state-core"
import * as asr from "@qyu/atom-state-react"
import * as sc from "@qyu/signal-core"
import ELConEdit_SecArgs from "@src/client/component/feature/console-edit/local/sec_args"
import ELConEdit_SecImg from "@src/client/component/feature/console-edit/local/sec_img"
import st from "@src/client/component/feature/console-edit/style/page.module.scss"
import EFStatusPage_NotFound from "@src/client/component/feature/status-page/element/page_notfound"
import EFStatusPage_Pending from "@src/client/component/feature/status-page/element/page_pending"
import EPAction_BtnClick from "@src/client/component/primitive/action/element/btn_click"
import EPAction_BtnSelectLang from "@src/client/component/primitive/action/element/btn_select_lang"
import EPAction_BtnToggle from "@src/client/component/primitive/action/element/btn_toggle"
import EPInText_Input from "@src/client/component/primitive/in-text/element/input"
import EPInText_ViewWeak from "@src/client/component/primitive/in-text/element/view_weak"
import st_intext from "@src/client/component/primitive/in-text/style/white.module.scss"
import EPInTextArea_Area from "@src/client/component/primitive/in-textarea/element/area"
import st_inarea from "@src/client/component/primitive/in-textarea/style/theme_white.module.scss"
import { urlmap } from "@src/client/urlmap"
import { compress_filedef } from "@src/client/util/compress/filedef"
import { imgref_data_apiurl } from "@src/client/util/imgref/data/apiurl"
import { lang_prop } from "@src/client/util/tl/prop"
import cl from "classnames"
import * as r from "react"
import * as ri18 from "react-i18next"
import * as rr from "react-router"
import { v7 as uuid } from "uuid"

const useLoad = function(tmplpr_id: string) {
    const loader = asr.useAtomChild({
        atomfamily: gs.rem.tmplpr.loaders.get_id,

        params: r.useMemo(() => ({
            id: tmplpr_id,
            include_hidden: 1 as const,
            pick_owner: ["null-private"],

            search: null,
        }), [tmplpr_id])
    })

    r.useEffect(() => {
        const cleanup = loader.request()

        return () => {
            cleanup()
        }
    }, [])
}

type UseTmplPr_Meta = {
    readonly status_pending: boolean
    readonly status_loadgrace: boolean
}

const useTmplPr = function(id: string): [cc.RemDef["tmplpr"]["joins"]["core"] | null, UseTmplPr_Meta] {
    const [status_loadgrace, status_loadgrace_set] = r.useState(true)

    const tmplpr_status_pending = asr.useAtomOutput(r.useCallback(
        ({ reg }) => sc.osignal_new_pipe(
            reg(rem.tmplpr.register).reg({ id }).real,
            real => real.status === asc.ReqState__Status.Pending
        ),
        [id]
    ), Object.is)

    const tmplpr_join = asr.useAtomOutput(r.useCallback(
        ({ reg }) => reg(rem.tmplpr.joins.core())({ id }),
        [id]
    ))

    useLoad(id)

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
            const data = tmplpr_join?.data

            if (data && data.deleted !== 1) {
                return data
            }

            return null
        }, [tmplpr_join?.data]),
        r.useMemo(() => {
            return {
                status_pending: tmplpr_status_pending,
                status_loadgrace: status_loadgrace,
            }
        }, [tmplpr_status_pending, status_loadgrace])
    ]
}

export type EFConEdit__PageTmplPr_Props = {

}

export const EFConEdit_PageTmplPr: r.FC<EFConEdit__PageTmplPr_Props> = props => {
    const { reg } = asr.useAtomStore()
    const { t, i18n } = ri18.useTranslation()

    const urlquery = rr.useParams()
    const tmplpr_id = urlquery.id

    if (tmplpr_id === undefined) {
        throw new Error("No id parameter")
    }

    const dispatch = asr.useAtomDispatch()
    const navigate = rr.useNavigate()
    const [lang, lang_set] = r.useState<null | string>(i18n.language)

    const [tmplpr, tmplpr_meta] = useTmplPr(tmplpr_id)

    if (tmplpr) {
        return <main className={st.page}>
            <div className={cl(st.sector, st.sector_block, st.sector_top)}>
                <ELConEdit_SecImg
                    imgs={tmplpr.refimgs}

                    img_srcdef_new={img => {
                        return imgref_data_apiurl(img)!
                    }}

                    img_post={file => {
                        const img_id = uuid()
                        const signal_reqstatus = sc.signal_new_value(asc.ReqState__Status.Pending)

                        dispatch(rem.img.act.post({
                            files_raw: {
                                img: [{
                                    kind: "file",

                                    data: {
                                        file: file,
                                    },
                                }] as const
                            },

                            files_process: async files_raw => {
                                return {
                                    img: await Promise.all(
                                        files_raw.img.map(async filedef => await compress_filedef(
                                            filedef, {
                                            useWebWorker: true,
                                            maxSizeMB: cst.config.server.img_maxsize >> 20,
                                        }))
                                    ) as [capi.FileDataDef]
                                }
                            },

                            body: {
                                id: img_id,
                            },

                            config: {
                                events: {
                                    failure: () => { signal_reqstatus.input(asc.ReqState__Status.Empty) },
                                    success: () => { signal_reqstatus.input(asc.ReqState__Status.Fulfilled) },
                                },
                            }
                        }))

                        dispatch(rem.tmplpr_refimg.act.post({
                            body: [{
                                core: {
                                    id: uuid(),
                                    img__id: img_id,
                                    tmplpr__id: tmplpr_id,
                                },

                                joins: {},
                            }],
                        }, {
                            deps: [reg(rem.img.register).reg({ id: img_id, })],
                        }))
                    }}

                    img_delete={img => {
                        dispatch(gs.rem.tmplpr_refimg.act.delete({
                            body: {
                                ids: [img.id]
                            },
                        }))
                    }}
                />

                <div className={cl(st.sector_top__info)}>
                    <div className={st.sector_top__name}>
                        <EPInText_ViewWeak
                            stmod={st_intext}
                            className={st.sector_top__name__input}
                            value={lang_prop(tmplpr, lang, "name", "")}
                        >
                            <EPInText_Input
                                placeholder={t(`tmplpr.placeholder_name`)}

                                event_value_change={value => {
                                    if (lang === null) {
                                        dispatch(gs.rem.tmplpr.act.patch({
                                            body: {
                                                id: tmplpr_id,

                                                patch: {
                                                    name: value,
                                                },
                                            },
                                        }))
                                    } else {
                                        for (const tlnode of tmplpr.tl) {
                                            if (tlnode.lang === lang) {
                                                dispatch(gs.rem.tmplpr_tl.act.patch({
                                                    body: {
                                                        id: tlnode.id,

                                                        patch: {
                                                            tltable: {
                                                                ...tlnode.tltable,

                                                                name: value,
                                                            },
                                                        },
                                                    },
                                                }))

                                                return
                                            }
                                        }

                                        dispatch(gs.rem.tmplpr_tl.act.post({
                                            body: [{
                                                core: {
                                                    id: uuid(),
                                                    lang,
                                                    source__id: tmplpr_id,

                                                    tltable: {
                                                        ...dbdef.table.tmplpr_tl.tltable,

                                                        name: value
                                                    },
                                                },

                                                joins: {},
                                            }],
                                        }))
                                    }
                                }}
                            />
                        </EPInText_ViewWeak>

                        <EPAction_BtnSelectLang
                            style_root

                            value={lang}
                            event_change={lang_set}
                        />

                        <EPAction_BtnToggle
                            style_root
                            icon={`eye_slash`}

                            state_active={tmplpr.status_hidden === 1}

                            event_click={() => {
                                dispatch(rem.tmplpr.act.patch({
                                    body: {
                                        id: tmplpr.id,

                                        patch: {
                                            status_hidden: Number(!tmplpr.status_hidden) as 0 | 1,
                                        },
                                    },
                                }))
                            }}
                        />

                        <EPAction_BtnClick
                            style_root
                            style_redclr
                            icon={`trashcan`}

                            event_click={() => {
                                dispatch(rem.tmplpr.act.delete({
                                    body: {
                                        ids: [tmplpr.id],
                                    },
                                }))

                                navigate(urlmap.shared.root())
                            }}
                        />
                    </div>

                    <div className={st.sector_top__textarea}>
                        <EPInTextArea_Area
                            stmod={st_inarea}

                            value_default={tmplpr.price_formula}
                            placeholder={t(`tmplpr.placeholder_price`)}
                            value_validator={src => src.trim() === "" || sxm.expr_validate(src)}

                            event_value_change={value => {
                                dispatch(gs.rem.tmplpr.act.patch({
                                    body: {
                                        id: tmplpr_id,

                                        patch: {
                                            price_formula: value,
                                        },
                                    },
                                }))
                            }}
                        />
                    </div>
                </div>
            </div>

            <ELConEdit_SecArgs
                args={tmplpr.args}
                tmplpr_id={tmplpr.id}
            />
        </main>
    } else {
        if (tmplpr_meta.status_pending || tmplpr_meta.status_loadgrace) {
            return <EFStatusPage_Pending />
        }

        return <EFStatusPage_NotFound />
    }
}

export default EFConEdit_PageTmplPr
