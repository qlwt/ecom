import * as gs from "@fst/gstate"
import { rem } from "@fst/gstate"
import * as asc from "@qyu/atom-state-core"
import * as asr from "@qyu/atom-state-react"
import * as rfl from "@qyu/reactcmp-flow-control"
import * as sc from "@qyu/signal-core"
import * as sr from "@qyu/signal-react"
import EPCardImg_Headln from "@src/client/component/primitive/card-img/element/headln"
import EPCardImg_Headln_Title from "@src/client/component/primitive/card-img/element/headln__title"
import EPCardImg_ImgView from "@src/client/component/primitive/card-img/element/img_view"
import EPCardImg_LayerFButton from "@src/client/component/primitive/card-img/element/layerf_button"
import EPCardImg_LayoutInfo from "@src/client/component/primitive/card-img/element/layout_info"
import EPCardImg_LayoutMainCol from "@src/client/component/primitive/card-img/element/layout_maincol"
import EPCardImg_View from "@src/client/component/primitive/card-img/element/view"
import { ELPSelectList_Grid } from "@src/client/component/primitive/selectlist/local/grid"
import st from "@src/client/component/primitive/selectlist/style/core.module.scss"
import { imgref_data_apiurl } from "@src/client/util/imgref/data/apiurl"
import { imgref_data_top } from "@src/client/util/imgref/data/top"
import { lang_prop } from "@src/client/util/tl/prop"
import * as r from "react"
import * as ri18 from "react-i18next"

type Paginator_Search = {
    readonly include_hidden: 0 | 1
    readonly include_private: 0 | 1
}

const paginator_new = function(store: asc.AtomStore, search: Paginator_Search) {
    return gs.paginator_new_list<gs.Rem_Node<"tmplmt">, Paginator_Search, string | null, number>({
        init: {
            data: [],
            cursor: null as null | string,
        },

        config: {
            search,
            retrydelay: 5000,
        },

        request_new: api => {
            return new Promise((res, rej) => {
                store.reg(rem.tmplmt.act.get({
                    query: {
                        limit: api.limit,
                        cursor: api.cursor ?? null,

                        include_hidden: search.include_hidden,
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

                                    ...(data.slice.tmplmt?.nodes ?? []).map(n => {
                                        return store.reg(rem.tmplmt.register).reg({ id: n.id })
                                    })
                                ])

                                res({ cursor: data.cursor } as const)
                            },
                        }
                    }
                }))
            })
        },
    })
}

type EL__Card_Props = {
    readonly node: gs.Rem_JoinData<"tmplmt">
    readonly state_selected: boolean

    readonly onClick?: VoidFunction
}

const EL_Card: r.FC<EL__Card_Props> = props => {
    const { i18n, t } = ri18.useTranslation()

    const header = lang_prop(props.node, i18n.language, "name").trim()
    const img_src = imgref_data_apiurl(imgref_data_top(props.node.refimgs))

    return <EPCardImg_View className={st.card}>
        <EPCardImg_LayerFButton event_click={props.onClick} state_disabled={props.state_selected}>
            <EPCardImg_LayoutMainCol>
                <EPCardImg_ImgView {...img_src} sizes={`30vw`} />

                <EPCardImg_LayoutInfo>
                    <EPCardImg_Headln style_center>
                        <EPCardImg_Headln_Title state_placeholder={header === ""}>
                            {header || t("commons.noname")}
                        </EPCardImg_Headln_Title>
                    </EPCardImg_Headln>
                </EPCardImg_LayoutInfo>
            </EPCardImg_LayoutMainCol>
        </EPCardImg_LayerFButton>
    </EPCardImg_View>
}

export type EPSelectList__TmplMt_Props = {
    readonly include_hidden: 0 | 1
    readonly include_private: 0 | 1

    readonly state_selected_new?: (id: string) => boolean

    readonly event_select: (ids: string[]) => void
}

export const EPSelectList_TmplMt: r.FC<EPSelectList__TmplMt_Props> = props => {
    const store = asr.useAtomStore()

    const paginator = r.useMemo(() => paginator_new(store, {
        include_hidden: props.include_hidden,
        include_private: props.include_private,
    }), [store, props.include_hidden, props.include_private])

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
                            reg(rem.tmplmt.joins.core())({ id: ndata.statics.id })
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

export default EPSelectList_TmplMt
