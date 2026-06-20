import * as capi from "@fst/capi"
import * as cc from "@fst/config/client"
import * as cst from "@fst/cst"
import * as gs from "@fst/gstate"
import { rem } from "@fst/gstate"
import * as asc from "@qyu/atom-state-core"
import * as asr from "@qyu/atom-state-react"
import * as sc from "@qyu/signal-core"
import ELConEdit_SecImg from "@src/client/component/feature/console-edit/local/sec_img"
import ELConEdit_SecTags from "@src/client/component/feature/console-edit/local/sec_tags"
import EFConEdit_SecVariant from "@src/client/component/feature/console-edit/local/sec_variant"
import st from "@src/client/component/feature/console-edit/style/page.module.scss"
import EFStatusPage_NotFound from "@src/client/component/feature/status-page/element/page_notfound"
import EFStatusPage_Pending from "@src/client/component/feature/status-page/element/page_pending"
import EPAction_BtnClick from "@src/client/component/primitive/action/element/btn_click"
import EPAction_BtnSelectLang from "@src/client/component/primitive/action/element/btn_select_lang"
import EPAction_BtnToggle from "@src/client/component/primitive/action/element/btn_toggle"
import EPInText_Input from "@src/client/component/primitive/in-text/element/input"
import EPInText_ViewWeak from "@src/client/component/primitive/in-text/element/view_weak"
import st_intext from "@src/client/component/primitive/in-text/style/white.module.scss"
import { urlmap } from "@src/client/urlmap"
import { compress_filedef } from "@src/client/util/compress/filedef"
import { imgref_data_apiurl } from "@src/client/util/imgref/data/apiurl"
import { lang_prop } from "@src/client/util/tl/prop"
import cl from "classnames"
import * as r from "react"
import * as ri18 from "react-i18next"
import * as rr from "react-router"
import { v7 as uuid } from "uuid"

const useLoad = function(item_id: string) {
    const loader = asr.useAtomChild({
        atomfamily: rem.item.loaders.get_id,

        params: r.useMemo(() => ({
            id: item_id,
            include_hidden: 1 as const,
            pick_owner: ["null-private"],

            search: null,
            filter_tag__id: null,
            pick_tmplit__id: null,
        }), [item_id])
    })

    r.useEffect(() => {
        const cleanup = loader.request()

        return () => {
            cleanup()
        }
    }, [])
}

type UseItem_Meta = {
    readonly status_pending: boolean
    readonly status_loadgrace: boolean
}

const useItem = function(id: string): [cc.RemDef["item"]["joins"]["core"] | null, UseItem_Meta] {
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

export type EFConEdit__PageItem_Props = {

}

export const EFConEdit_PageItem: r.FC<EFConEdit__PageItem_Props> = props => {
    const { t, i18n, } = ri18.useTranslation()
    const { reg } = asr.useAtomStore()

    const urlquery = rr.useParams()
    const item_id = urlquery.id

    if (item_id === undefined) {
        throw new Error("No id parameter")
    }

    const navigate = rr.useNavigate()
    const dispatch = asr.useAtomDispatch()
    const [lang, lang_set] = r.useState<null | string>(i18n.language)

    const [item, item_meta] = useItem(item_id)

    if (item) {
        return <main className={st.page}>
            <div className={cl(st.sector, st.sector_block, st.sector_top)}>
                <ELConEdit_SecImg
                    imgs={item.refimgs}

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

                        dispatch(rem.item_refimg.act.post({
                            body: [{
                                core: {
                                    id: uuid(),
                                    img__id: img_id,
                                    item__id: item_id,
                                },

                                joins: {},
                            }],
                        }, {
                            deps: [reg(rem.img.register).reg({ id: img_id, })],
                        }))
                    }}

                    img_delete={refimg => {
                        dispatch(gs.rem.item_refimg.act.delete({
                            body: {
                                ids: [refimg.id]
                            },
                        }))
                    }}
                />

                <div className={cl(st.sector_top__info)}>
                    <div className={st.sector_top__name}>
                        <EPInText_ViewWeak
                            stmod={st_intext}
                            className={st.sector_top__name__input}
                            value={lang_prop(item, lang, "name", "")}
                        >
                            <EPInText_Input
                                placeholder={t(`item.placeholder_name`)}

                                event_value_change={value => {
                                    if (lang === null) {
                                        dispatch(gs.rem.item.act.patch({
                                            body: {
                                                id: item_id,

                                                patch: {
                                                    name: value,
                                                },
                                            },
                                        }))
                                    } else {
                                        for (const tlnode of item.tl) {
                                            if (tlnode.lang === lang) {
                                                dispatch(gs.rem.item_tl.act.patch({
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

                                        dispatch(gs.rem.item_tl.act.post({
                                            body: [{
                                                core: {
                                                    id: uuid(),
                                                    lang,
                                                    source__id: item_id,
                                                    tltable: { name: value },
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

                            state_active={item.status_hidden === 1}

                            event_click={() => {
                                dispatch(rem.item.act.patch({
                                    body: {
                                        id: item.id,

                                        patch: {
                                            status_hidden: Number(!item.status_hidden) as 0 | 1,
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
                                dispatch(rem.item.act.delete({
                                    body: {
                                        ids: [item.id],
                                    },
                                }))

                                navigate(urlmap.shared.root())
                            }}
                        />
                    </div>

                    <div className={st.sector_top__tags}>
                        <ELConEdit_SecTags
                            lang={lang}
                            parent_base={`item`}
                            parent_id={item.id}
                            reftag_list={item.reftags}

                        // tag_join={gs.rem.item_tag.joins.core}
                        //
                        // tagtl_post={params => {
                        //     dispatch(gs.rem.item_tag_tl.act.post({
                        //         body: [{
                        //             core: {
                        //                 ...params.body,
                        //
                        //                 source__id: params.parent.id,
                        //             },
                        //
                        //             joins: {},
                        //         }],
                        //     }))
                        // }}
                        //
                        // tagtl_patch={params => {
                        //     dispatch(gs.rem.item_tl.act.patch({
                        //         body: {
                        //             id: params.url.id,
                        //
                        //             patch: {
                        //                 ...params.body,
                        //             },
                        //         },
                        //     }))
                        // }}
                        //
                        // tag_patch={params => {
                        //     dispatch(gs.rem.item_tag.act.patch({
                        //         body: {
                        //             id: params.url.id,
                        //
                        //             patch: {
                        //                 ...params.body
                        //             },
                        //         },
                        //     }))
                        // }}
                        //
                        // tag_delete={params => {
                        //     dispatch(gs.rem.item_tag.act.delete({
                        //         body: {
                        //             ids: [params.body.id]
                        //         },
                        //     }))
                        // }}
                        //
                        // reftag_post={params => {
                        //     dispatch(gs.rem.item_reftag.act.post({
                        //         config: {
                        //             events: params.events,
                        //         },
                        //
                        //         body: [{
                        //             core: {
                        //                 id: params.body.id,
                        //
                        //                 item__id: item_id,
                        //                 item_tag__id: typeof params.body.tag === "string" ? params.body.tag : params.body.tag.id,
                        //             },
                        //
                        //             joins: {
                        //                 tag: typeof params.body.tag === "object" ? {
                        //                     core: {
                        //                         id: params.body.tag.id,
                        //                         name: params.body.tag.name,
                        //                         status_hidden: params.body.tag.status_hidden,
                        //                     },
                        //
                        //                     joins: {},
                        //                 } : null
                        //             },
                        //         }]
                        //     }))
                        // }}
                        //
                        // reftag_delete={params => {
                        //     dispatch(gs.rem.item_reftag.act.delete({
                        //         body: {
                        //             ids: [params.body.id],
                        //         }
                        //     }))
                        // }}
                        //
                        // reftag_patch={params => {
                        //     dispatch(gs.rem.item_reftag.act.patch({
                        //         body: {
                        //             id: params.body.id
                        //
                        //             patch: {
                        //                 item_tag__id: params.body.tag_id,
                        //             },
                        //         },
                        //     }))
                        // }}
                        //
                        // tag_get={params => {
                        //     const promise = capi.send_rest_data_get("item_tag", {
                        //         config: {
                        //             signal_abort: params.signal_abort,
                        //         },
                        //
                        //         query: {
                        //             limit: 1000,
                        //             cursor: null,
                        //             include_hidden: 1,
                        //         },
                        //     })
                        //
                        //     return promise.then(res => {
                        //         if (res.success) {
                        //             sc.batcher.batch_sync(() => {
                        //                 dispatch(gs.nrem_dbslice_use(rem, res.body.slice))
                        //             })
                        //
                        //             return (res.body.slice.item_tag?.nodes ?? []).map(node => node.id)
                        //         }
                        //
                        //         return null
                        //     })
                        // }}
                        />
                    </div>
                </div>
            </div>

            <div className={cl(st.sector, st.sector_block)}>
                <EFConEdit_SecVariant item={item} />
            </div>
        </main>

    } else {
        if (item_meta.status_pending || item_meta.status_loadgrace) {
            return <EFStatusPage_Pending />
        }

        return <EFStatusPage_NotFound />
    }
}

export default EFConEdit_PageItem
