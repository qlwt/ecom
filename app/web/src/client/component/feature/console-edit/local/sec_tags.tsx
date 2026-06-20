import * as capi from "@fst/capi"
import * as cc from "@fst/config/client"
import * as gs from "@fst/gstate"
import { rem } from "@fst/gstate"
import * as asr from "@qyu/atom-state-react"
import * as rfl from "@qyu/reactcmp-flow-control"
import * as sc from "@qyu/signal-core"
import st from "@src/client/component/feature/console-edit/style/sec_tags.module.scss"
import EPAction_BtnClick from "@src/client/component/primitive/action/element/btn_click"
import EPAction_BtnToggle from "@src/client/component/primitive/action/element/btn_toggle"
import { lang_prop } from "@src/client/util/tl/prop"
import cl from "classnames"
import * as r from "react"
import { v7 as uuid } from "uuid"

type TagJoin = cc.RemDef[`${ELConEdit__SecTags_ParentBase}_tag`]["joins"]["core"]
// type RefTagJoin = cc.RemDef[`${ELConEdit__SecTags_ParentBase}_reftag`]["joins"]["core"]

export type ELConEdit__SecTags_ParentBase = "item" | "material"

// export type ELConEdit__SecTags_TagDelete_Params = {
//     readonly body: {
//         readonly id: string
//     }
// }
//
// export type ELConEdit__SecTags_TagTlPatch_Params = {
//     readonly body: {
//         readonly id: string
//
//         readonly patch: {
//             readonly tltable: Record<string, string>
//         }
//     }
// }
//
// export type ELConEdit__SecTags_TagTlPost_Params = {
//     readonly parent: {
//         readonly id: string
//     }
//
//     readonly body: {
//         readonly id: string
//         readonly lang: string
//         readonly tltable: Record<string, string>
//     }
// }
//
// export type ELConEdit__SecTags_TagPatch_Params = {
//     readonly body: {
//         readonly id: string
//
//         readonly patch: {
//             readonly name?: string
//             readonly status_hidden?: 0 | 1
//         }
//     }
// }
//
// export type ELConEdit__SecTags_TagRefDelete_Params = {
//     readonly body: {
//         readonly id: string
//     }
// }
//
// export type ELConEdit__SecTags_TagRefPatch_Params = {
//     readonly body: {
//         readonly id: string
//         readonly tag_id: string
//     }
// }

type EL__Tag_Props = {
    readonly tag: TagJoin
    readonly lang: string | null
    readonly reftag_id: string | null
    readonly parent_id: string
    readonly parent_base: ELConEdit__SecTags_ParentBase

    // readonly tag_patch: (params: ELConEdit__SecTags_TagPatch_Params) => void
    // readonly tag_delete: (params: ELConEdit__SecTags_TagDelete_Params) => void
    // readonly tagtl_post: (params: ELConEdit__SecTags_TagTlPost_Params) => void
    // readonly tagtl_patch: (params: ELConEdit__SecTags_TagTlPatch_Params) => void
    // readonly reftag_post: (params: ELConEdit__SecTags_TagRefPost_Params) => void
    // readonly reftag_patch: (params: ELConEdit__SecTags_TagRefPatch_Params) => void
    // readonly reftag_delete: (params: ELConEdit__SecTags_TagRefDelete_Params) => void
}

const EL_Tag: r.FC<EL__Tag_Props> = props => {
    const { reg } = asr.useAtomStore()

    return <div className={st.tag}>
        <input
            type={`text`}
            className={cl(st.tag__input, st.tag__item)}
            value={lang_prop(props.tag, props.lang, "name", "")}

            onChange={ev => {
                if (props.lang === null) {
                    reg(rem[`${props.parent_base}_tag`].act.patch({
                        body: {
                            id: props.tag.id,

                            patch: {
                                name: ev.target.value,
                            },
                        },
                    }))
                } else {
                    for (const tlnode of props.tag.tl) {
                        if (tlnode.lang === props.lang) {
                            reg(rem[`${props.parent_base}_tag_tl`].act.patch({
                                body: {
                                    id: tlnode.id,

                                    patch: {
                                        tltable: {
                                            ...tlnode.tltable,

                                            name: ev.target.value,
                                        },
                                    },
                                },
                            }))

                            return
                        }
                    }

                    reg(rem[`${props.parent_base}_tag_tl`].act.post({
                        body: [{
                            core: {
                                id: uuid(),
                                lang: props.lang,
                                source__id: props.tag.id,
                                tltable: { name: ev.target.value, },
                            },

                            joins: {},
                        }]
                    }))
                }
            }}
        />

        <EPAction_BtnToggle
            icon={`check`}
            style_shadow_type={`none`}
            className={cl(st.tag__btn, st.tag__item)}
            state_active={props.reftag_id !== null}

            event_click={() => {
                if (props.reftag_id !== null) {
                    reg(rem[`${props.parent_base}_reftag`].act.delete({
                        body: {
                            ids: [props.reftag_id],
                        },
                    }))
                } else {
                    reg(rem[`${props.parent_base}_reftag`].act.post({
                        body: [{
                            core: {
                                id: uuid(),

                                ...{
                                    [`${props.parent_base}_tag__id`]: props.tag.id,
                                } as { [K in `${ELConEdit__SecTags_ParentBase}_tag__id`]: string },

                                ...{
                                    [`${props.parent_base}__id`]: props.parent_id,
                                } as { [K in `${ELConEdit__SecTags_ParentBase}__id`]: string },
                            },

                            joins: {},
                        }],
                    }))
                }
            }}
        />

        <EPAction_BtnToggle
            icon={`eye_slash`}

            state_active={props.tag.status_hidden === 1}

            event_click={() => {
                reg(rem[`${props.parent_base}_tag`].act.patch({
                    body: {
                        id: props.tag.id,

                        patch: {
                            status_hidden: Number(!props.tag.status_hidden) as 0 | 1,
                        }
                    },
                }))
            }}
        />

        <EPAction_BtnClick
            style_redclr
            icon={`trashcan`}
            style_shadow_type={`none`}
            className={cl(st.tag__btn, st.tag__item)}

            event_click={() => {
                reg(rem[`${props.parent_base}_tag`].act.delete({
                    body: {
                        ids: [props.tag.id],
                    },
                }))
            }}
        />
    </div>
}

// export type ELConEdit__SecTags_TagRefPost_Params = {
//     readonly events?: capi.ApiResponse_Events<any>
//
//     readonly body: {
//         readonly id: string
//
//         readonly tag: string | {
//             readonly id: string
//             readonly value: string
//             readonly access_hidden: 0 | 1
//             readonly access_static: 0 | 1
//         }
//     }
// }

// export type ELConEdit__SecTags_TagGet_Params = {
//     readonly signal_abort: AbortSignal
// }

export type ELConEdit__SecTags_Props = {
    readonly parent_id: string
    readonly lang: string | null
    readonly parent_base: ELConEdit__SecTags_ParentBase
    readonly reftag_list: readonly (cc.RemDef["item_reftag"]["joins"]["core"] | cc.RemDef["material_reftag"]["joins"]["core"])[]

    // readonly reftag_nodes: readonly NonNullable<ELConEdit__SecTags_RefTagJoin["data"]>[]
    // readonly reftag_delete: (params: ELConEdit__SecTags_TagRefDelete_Params) => void
    // readonly reftag_patch: (params: ELConEdit__SecTags_TagRefPatch_Params) => void
    // readonly reftag_post: (params: ELConEdit__SecTags_TagRefPost_Params) => void
    // readonly tagtl_post: (params: ELConEdit__SecTags_TagTlPost_Params) => void
    // readonly tagtl_patch: (params: ELConEdit__SecTags_TagTlPatch_Params) => void
    // readonly tag_patch: (params: ELConEdit__SecTags_TagPatch_Params) => void
    // readonly tag_delete: (params: ELConEdit__SecTags_TagDelete_Params) => void
    // readonly tag_get: (params: ELConEdit__SecTags_TagGet_Params) => Promise<string[] | null>
    // readonly tag_join: () => asc.AtomSelectorStatic<(params: { id: string }) => sc.OSignal<ELConEdit__SecTags_TagJoin | null>>
}

export const ELConEdit_SecTags: r.FC<ELConEdit__SecTags_Props> = props => {
    const { reg } = asr.useAtomStore()

    const query = r.useMemo(() => {
        return gs.query_new<void, null, string[]>({
            init: [],

            config: {
                search: null,
                retrydelay: 7000,
            },

            request_new: async api => {
                const result = await capi.send_rest_data_get(`${props.parent_base}_tag`, {
                    query: {
                        limit: 1000,
                        cursor: null,
                        include_hidden: 1,
                        pick_owner: ["null-private"],

                        filter_tmplit__id: null,
                    },

                    config: {
                        signal_abort: api.signal_abort,
                    },
                })

                if (result.success) {
                    sc.batcher.batch_sync(() => {
                        reg(gs.nrem_dbslice_use(rem, result.body.slice))
                    })

                    return (result.body.slice[`${props.parent_base}_tag`]?.nodes ?? []).map(node => {
                        return node.id
                    })
                }

                return undefined
            },
        })
    }, [props.parent_base, reg])

    const refmap = r.useMemo(() => {
        const result = new Map<string, string>()

        for (const reftag of props.reftag_list) {
            result.set(reftag.tag.id, reftag.id)
        }

        return result
    }, [props.reftag_list])

    r.useLayoutEffect(() => {
        query.load()

        return () => {
            query.cleanup()
        }
    }, [query])

    const query_data = asr.useAtomOutput(r.useMemo(() => ({ reg }) => {
        return sc.osignal_new_memo(sc.osignal_new_pipeflat(
            sc.osignal_new_listpipe(
                query.data,
                id => {
                    return sc.osignal_new_memo(sc.osignal_new_pipe(
                        reg(rem[`${props.parent_base}_tag`].joins.core())({ id }),
                        join => {
                            if (!join?.data || join.data.deleted === 1) {
                                return null
                            }

                            return join.data
                        }
                    ), null)
                }
            ),
            join_slist => {
                return sc.osignal_new_pipe(
                    sc.osignal_new_merge(join_slist),
                    join_list => join_list.filter(join => join !== null)
                )
            }
        ), null)
    }, [query.data]))

    return <div className={st.root}>
        <rfl.CmpRequire value={[query_data] as const}>
            {([query_data]) => {
                return <>
                    <EPAction_BtnClick
                        style_root
                        icon={`post`}
                        className={st.tag__btn}
                        style_shadow_type={`none`}

                        event_click={() => {
                            const tag_id = uuid()
                            const tagref_id = uuid()

                            {
                                const query_rawdata = query.data.output()

                                if (query_rawdata) {
                                    query.data.input([tag_id, ...query_rawdata])
                                }
                            }

                            reg(rem[`${props.parent_base}_reftag`].act.post({
                                body: [{
                                    core: {
                                        id: tagref_id,

                                        ...{
                                            [`${props.parent_base}_tag__id`]: tag_id,
                                        } as { [K in `${ELConEdit__SecTags_ParentBase}_tag__id`]: string },

                                        ...{
                                            [`${props.parent_base}__id`]: props.parent_id,
                                        } as { [K in `${ELConEdit__SecTags_ParentBase}__id`]: string },
                                    },

                                    joins: {
                                        tag: {
                                            core: {
                                                id: tag_id,
                                                name: "",
                                                status_hidden: 1,
                                            },

                                            joins: {},
                                        },
                                    },
                                }],

                                config: {
                                    events: {
                                        failure: () => {
                                            const query_rawdata = query.data.output()

                                            if (query_rawdata) {
                                                query.data.input(query_rawdata.filter(node => node !== tag_id))
                                            }
                                        },
                                    },
                                },
                            }))
                        }}
                    />

                    <rfl.CmpLoop data={query_data}>
                        {tagnode => {
                            return <EL_Tag
                                key={tagnode.id}

                                tag={tagnode}
                                lang={props.lang}
                                parent_id={props.parent_id}
                                parent_base={props.parent_base}
                                reftag_id={refmap.get(tagnode.id) ?? null}

                            // tagtl_post={props.tagtl_post}
                            // tagtl_patch={props.tagtl_patch}
                            // tag_patch={props.tag_patch}
                            // tag_delete={props.tag_delete}
                            // reftag_post={props.reftag_post}
                            // reftag_patch={props.reftag_patch}
                            // reftag_delete={props.reftag_delete}
                            />
                        }}
                    </rfl.CmpLoop>
                </>
            }}
        </rfl.CmpRequire>
    </div>
}

export default ELConEdit_SecTags
