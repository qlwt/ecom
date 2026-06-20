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
import st from "@src/client/component/feature/console-edit/style/page.module.scss"
import EFStatusPage_NotFound from "@src/client/component/feature/status-page/element/page_notfound"
import EFStatusPage_Pending from "@src/client/component/feature/status-page/element/page_pending"
import EPAction_BtnClick from "@src/client/component/primitive/action/element/btn_click"
import EPAction_BtnSelectLang from "@src/client/component/primitive/action/element/btn_select_lang"
import EPAction_BtnToggle from "@src/client/component/primitive/action/element/btn_toggle"
import { urlmap } from "@src/client/urlmap"
import { compress_filedef } from "@src/client/util/compress/filedef"
import { imgref_data_apiurl } from "@src/client/util/imgref/data/apiurl"
import cl from "classnames"
import * as r from "react"
import * as ri18 from "react-i18next"
import * as rr from "react-router"
import { v7 as uuid } from "uuid"

const useLoad = function(material_id: string) {
    const loader = asr.useAtomChild({
        atomfamily: rem.material.loaders.get_id,

        params: r.useMemo(() => ({
            id: material_id,
            include_hidden: 1 as const,
            pick_owner: ["null-private"],

            search: null,
            pick_tmplmt__id: null,
        }), [material_id])
    })

    r.useEffect(() => {
        const cleanup = loader.request()

        return () => {
            cleanup()
        }
    }, [])
}

type UseMaterial_Meta = {
    readonly status_pending: boolean
    readonly status_loadgrace: boolean
}

const useMaterial = function(id: string): [cc.RemDef["material"]["joins"]["core"] | null, UseMaterial_Meta] {
    const [status_loadgrace, status_loadgrace_set] = r.useState(true)

    const material_status_pending = asr.useAtomOutput(r.useCallback(
        ({ reg }) => sc.osignal_new_pipe(
            reg(rem.material.register).reg({ id }).real,
            real => real.status === asc.ReqState__Status.Pending
        ),
        [id]
    ), Object.is)

    const material_join = asr.useAtomOutput(r.useCallback(
        ({ reg }) => reg(rem.material.joins.core())({ id }),
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
            const data = material_join?.data

            if (data && data.deleted !== 1) {
                return data
            }

            return null
        }, [material_join?.data]),
        r.useMemo(() => {
            return {
                status_pending: material_status_pending,
                status_loadgrace: status_loadgrace,
            }
        }, [material_status_pending, status_loadgrace])
    ]
}

export type EFConEdit__PageMaterial_Props = {

}

export const EFConEdit_PageMaterial: r.FC<EFConEdit__PageMaterial_Props> = props => {
    const { reg } = asr.useAtomStore()
    const { i18n } = ri18.useTranslation()

    const urlquery = rr.useParams()
    const material_id = urlquery.id

    if (material_id === undefined) {
        throw new Error("No id parameter")
    }

    const navigate = rr.useNavigate()
    const dispatch = asr.useAtomDispatch()
    const [lang, lang_set] = r.useState<null | string>(i18n.language)

    const [material, material_meta] = useMaterial(material_id)

    if (material) {
        return <main className={st.page}>
            <div className={cl(st.sector, st.sector_block, st.sector_top)}>
                <ELConEdit_SecImg
                    imgs={material.refimgs}

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

                        dispatch(rem.material_refimg.act.post({
                            body: [{
                                core: {
                                    id: uuid(),
                                    img__id: img_id,
                                    material__id: material_id,
                                },

                                joins: {},
                            }],
                        }, {
                            deps: [reg(rem.img.register).reg({ id: img_id, })],
                        }))
                    }}

                    img_delete={img => {
                        dispatch(gs.rem.material_refimg.act.delete({
                            body: {
                                ids: [img.id]
                            },
                        }))
                    }}
                />

                <div className={cl(st.sector_top__info)}>
                    <div className={st.sector_top__acts}>
                        <EPAction_BtnSelectLang
                            style_root

                            value={lang}
                            event_change={lang_set}
                        />

                        <EPAction_BtnToggle
                            style_root
                            icon={`fatarrow-bottom`}

                            state_active={material.status_available === 0}

                            event_click={() => {
                                dispatch(rem.material.act.patch({
                                    body: {
                                        id: material.id,

                                        patch: {
                                            status_available: Number(!material.status_available) as 0 | 1,
                                        }
                                    },
                                }))
                            }}
                        />

                        <EPAction_BtnToggle
                            style_root
                            icon={`eye_slash`}

                            state_active={material.status_hidden === 1}

                            event_click={() => {
                                dispatch(rem.material.act.patch({
                                    body: {
                                        id: material.id,

                                        patch: {
                                            status_hidden: Number(!material.status_hidden) as 0 | 1,
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
                                dispatch(rem.material.act.delete({
                                    body: {
                                        ids: [material.id]
                                    }
                                }))

                                navigate(urlmap.shared.root())
                            }}
                        />
                    </div>

                    <div className={st.sector_top__tags}>
                        <ELConEdit_SecTags
                            lang={lang}
                            parent_id={material.id}
                            parent_base={`material`}
                            reftag_list={material.reftags}

                        // tag_join={gs.rem.material_tag.sel.join}
                        //
                        // tagtl_post={params => {
                        //     dispatch(gs.rem.tl.act.post({
                        //         act: {},
                        //
                        //         request: {
                        //             body: {
                        //                 nodes: [{
                        //                     ...params.body,
                        //
                        //                     access_hidden: 0,
                        //                     access_static: 0,
                        //                     source_id: params.parent.id,
                        //                 }],
                        //
                        //                 access: {
                        //                     owner: null,
                        //                 },
                        //             }
                        //         },
                        //     }))
                        // }}
                        //
                        // tagtl_patch={params => {
                        //     dispatch(gs.rem.tl.act.patch_id({
                        //         act: {},
                        //
                        //         request: {
                        //             url: {
                        //                 ...params.url,
                        //             },
                        //
                        //             body: {
                        //                 ...params.body,
                        //             },
                        //         },
                        //     }))
                        // }}
                        //
                        // tag_patch={params => {
                        //     dispatch(gs.rem.material_tag.act.patch_id({
                        //         act: {},
                        //
                        //         request: {
                        //             url: {
                        //                 id: params.url.id
                        //             },
                        //
                        //             body: {
                        //                 value: params.body.value,
                        //             },
                        //         },
                        //     }))
                        // }}
                        //
                        // tag_delete={params => {
                        //     dispatch(gs.rem.material_tag.act.delete({
                        //         act: {},
                        //
                        //         request: {
                        //             body: {
                        //                 ids: [params.body.id]
                        //             },
                        //         },
                        //     }))
                        // }}
                        //
                        // reftag_nodes={material.tags.map(tagref => {
                        //     return {
                        //         ...tagref,
                        //
                        //         tag: tagref.tag,
                        //     }
                        // })}
                        //
                        // reftag_post={params => {
                        //     dispatch(gs.rem.material_reftag.act.post({
                        //         act: {},
                        //
                        //         request: {
                        //             config: {
                        //                 events: params.events,
                        //             },
                        //
                        //             body: {
                        //                 nodes: [{
                        //                     id: params.body.id,
                        //
                        //                     material_id,
                        //                     access_hidden: 0,
                        //                     access_static: 0,
                        //                     material_tag_id: params.body.tag
                        //                 }],
                        //
                        //                 access: {
                        //                     owner: null,
                        //                 },
                        //             }
                        //         }
                        //     }))
                        // }}
                        //
                        // reftag_delete={params => {
                        //     dispatch(gs.rem.material_reftag.act.delete({
                        //         act: {},
                        //
                        //         request: {
                        //             body: {
                        //                 ids: [params.body.id],
                        //             }
                        //         }
                        //     }))
                        // }}
                        //
                        // reftag_patch={params => {
                        //     dispatch(gs.rem.material_reftag.act.patch_id({
                        //         act: {},
                        //
                        //         request: {
                        //             body: {
                        //                 material_tag_id: params.body.tag_id
                        //             },
                        //
                        //             url: {
                        //                 id: params.body.id
                        //             },
                        //         }
                        //     }))
                        // }}
                        //
                        // tag_get={params => {
                        //     const promise = capi.send_dbtable_get("material_tag", {
                        //         config: {
                        //             signal_abort: params.signal_abort,
                        //         },
                        //
                        //         query: {
                        //             pointer: 0,
                        //             limit: 1000,
                        //
                        //             access_hidden: null,
                        //             access_owners: [],
                        //             access_public: 1,
                        //         },
                        //     })
                        //
                        //     return promise.then(res => {
                        //         if (res.success) {
                        //             sc.batcher.batch_sync(() => {
                        //                 for (const dbslice of res.body.dbslices) {
                        //                     dispatch(gs.dbslice_use({ dbslice }))
                        //                 }
                        //             })
                        //
                        //             return res.body.dbslices.map(dbslice => {
                        //                 return (dbslice.indexed.material_tag || []).map(node => node.id)
                        //             }).flat(1)
                        //         }
                        //
                        //         return null
                        //     })
                        // }}
                        />
                    </div>
                </div>
            </div>
        </main>
    } else {
        if (material_meta.status_pending || material_meta.status_loadgrace) {
            return <EFStatusPage_Pending />
        }

        return <EFStatusPage_NotFound />
    }
}

export default EFConEdit_PageMaterial
