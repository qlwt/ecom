import * as gs from "@fst/gstate"
import { rem } from "@fst/gstate"
import * as asc from "@qyu/atom-state-core"
import * as asr from "@qyu/atom-state-react"
import * as rfl from "@qyu/reactcmp-flow-control"
import * as sc from "@qyu/signal-core"
import * as sr from "@qyu/signal-react"
import EPCardImg_ImgView from "@src/client/component/primitive/card-img/element/img_view"
import EPCardImg_LayerFButton from "@src/client/component/primitive/card-img/element/layerf_button"
import EPCardImg_LayoutMainCol from "@src/client/component/primitive/card-img/element/layout_maincol"
import EPCardImg_View from "@src/client/component/primitive/card-img/element/view"
import { ELPSelectList_Grid } from "@src/client/component/primitive/selectlist/local/grid"
import st from "@src/client/component/primitive/selectlist/style/core.module.scss"
import { imgref_data_apiurl } from "@src/client/util/imgref/data/apiurl"
import { imgref_data_top } from "@src/client/util/imgref/data/top"
import { lang_prop } from "@src/client/util/tl/prop"
import type { TmplMtNode_Data } from "@src/client/util/tmplmt/type/node"
import cl from "classnames"
import * as r from "react"
import * as ri18 from "react-i18next"

type Paginator_Search = {
    readonly tmplmt_ids: string[] | undefined
    readonly include_hidden: 0 | 1
    readonly include_private: 0 | 1
}

const paginator_new = function(store: asc.AtomStore, search: Paginator_Search) {
    return gs.paginator_new_list<gs.Rem_Node<"material">, Paginator_Search, string | null, number>({
        init: {
            data: [],
            cursor: null as null | string,
        },

        config: {
            search: search,
            retrydelay: 5000,
        },

        request_new: api => {
            return new Promise((res, rej) => {
                store.reg(rem.material.act.get({
                    query: {
                        limit: api.limit,
                        cursor: api.cursor ?? null,

                        include_hidden: search.include_hidden,
                        pick_tmplmt__id: search.tmplmt_ids ?? null,
                        pick_owner: api.search.include_private ? ["null-private"] : ["null-public"],

                        search: null,
                    },

                    config: {
                        signal_abort: api.signal_abort,

                        events: {
                            failure: reason => {
                                rej(reason)
                            },

                            success: data => {
                                api.data.input([
                                    ...api.data.output(),

                                    ...(data.slice.material?.nodes ?? []).map(n => {
                                        return store.reg(rem.material.register).reg({ id: n.id })
                                    })
                                ])

                                res({ cursor: data.cursor } as const)
                            },
                        }
                    },
                }))
            })
        },
    })
}

type EL__Card_Props = {
    readonly node: gs.Rem_JoinData<"material">

    readonly state_selected: boolean

    readonly onClick?: VoidFunction
}

const EL_Card: r.FC<EL__Card_Props> = props => {
    const img_src = imgref_data_apiurl(imgref_data_top(props.node.refimgs))

    return <EPCardImg_View className={st.card}>
        <EPCardImg_LayerFButton event_click={props.onClick} state_disabled={props.state_selected}>
            <EPCardImg_LayoutMainCol>
                <EPCardImg_ImgView {...img_src} sizes={`30vw`} />
            </EPCardImg_LayoutMainCol>
        </EPCardImg_LayerFButton>
    </EPCardImg_View>
}

const useTemplateSelection = function(datas: readonly TmplMtNode_Data[]) {
    const [sel, sel_set] = r.useState(() => datas?.[0]?.id ?? null)

    const sel_view = r.useMemo(() => {
        if (datas === undefined) {
            return null
        }

        for (const data of datas) {
            if (data.id === sel) {
                return sel
            }
        }

        return datas[0]?.id ?? null
    }, [sel, datas])

    return [sel_view, sel_set] as const
}

export type EPSelectList__Material_Props = {
    readonly include_hidden: 0 | 1
    readonly include_private: 0 | 1

    readonly templates: readonly TmplMtNode_Data[]
    readonly state_selected_new?: (id: string) => boolean

    readonly event_select: (ids: string[]) => void
}

export const EPSelectList_Material: r.FC<EPSelectList__Material_Props> = props => {
    const store = asr.useAtomStore()
    const { i18n } = ri18.useTranslation()
    const [tmplsel, tmplsel_set] = useTemplateSelection(props.templates)

    const paginator = r.useMemo(() => {
        return paginator_new(store, {
            tmplmt_ids: tmplsel ? [tmplsel] : undefined,
            include_hidden: props.include_hidden,
        include_private: props.include_private,
        })
    }, [store, tmplsel, props.include_hidden, props.include_private])

    r.useEffect(() => {
        if (paginator.status.output() === gs.PaginatorList_Status.Idle) {
            paginator.load(20)
        }
    }, [paginator])

    const paginator_status = sr.useSignalOutput(paginator.status)

    const paginator_data = asr.useAtomConnect(r.useMemo(() => {
        return ({ reg }) => {
            return sc.osignal_new_memo(sc.osignal_new_pipe(
                sc.osignal_new_pipeflat(
                    sc.osignal_new_listpipe(paginator.data, ndata => {
                        return sc.osignal_new_memo(
                            reg(rem.material.joins.core())({ id: ndata.statics.id })
                        )
                    }),
                    nodes => {
                        return sc.osignal_new_merge(nodes)
                    }
                ),
                m => m.filter(n => n !== null)
            ))
        }
    }, [paginator.data]))

    return <div className={st.root}>
        <rfl.CmpRequire value={[props.templates] as const} state_empty={([ids]) => ids.length === 0}>
            {([tmplmt_ids]) => {
                return <div className={st.nav}>
                    <rfl.CmpLoop data={tmplmt_ids}>
                        {tmplmt_data => {
                            const selected = tmplmt_data.id === tmplsel

                            return <button
                                key={tmplmt_data.id}

                                disabled={selected}
                                className={cl(st.nav__item, selected && st._active)}

                                onClick={() => {
                                    tmplsel_set(tmplmt_data.id)
                                }}
                            >
                                {lang_prop(tmplmt_data, i18n.language, "name")}
                            </button>
                        }}
                    </rfl.CmpLoop>
                </div>
            }}
        </rfl.CmpRequire>

        <rfl.CmpRequire value={[paginator_data.value] as const}>
            {([paginator_data]) => <ELPSelectList_Grid
                paginator_status={paginator_status}
                paginator_load={() => paginator.load(20)}
                src_length={paginator_data.length}

                src_render={index => {
                    const node = paginator_data[index]!

                    if (node.data && !node.data.deleted) {
                        return <EL_Card
                            key={node.meta.statics.id}

                            node={node.data}
                            state_selected={props.state_selected_new?.(node.meta.statics.id) ?? false}

                            onClick={() => {
                                props.event_select([node.meta.statics.id])
                            }}
                        />
                    }

                    return null
                }}
            />}
        </rfl.CmpRequire>
    </div>
}

export default EPSelectList_Material
