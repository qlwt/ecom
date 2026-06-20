import * as fas_search from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass"
import * as fas_plus from "@fortawesome/free-solid-svg-icons/faPlus"
import * as faw from "@fortawesome/react-fontawesome"
import * as capi from "@fst/capi"
import { rem } from "@fst/gstate"
import * as asr from "@qyu/atom-state-react"
import * as ddn from "@qyu/reactcmp-dropdown"
import * as sc from "@qyu/signal-core"
import { EFCon_NodeKind } from "@src/client/component/feature/console/cst/NodeKind"
import st from "@src/client/component/feature/console/style/filter.module.scss"
import type { EFCon_Paginator__DataNode } from "@src/client/component/feature/console/type/paginator"
import EPInOption_View from "@src/client/component/primitive/in-option/element/view"
import stheme_inoption_form from "@src/client/component/primitive/in-option/style/theme_form.module.scss"
import { EPInText_IconView } from "@src/client/component/primitive/in-text/element/icon_view"
import EPInText_Input from "@src/client/component/primitive/in-text/element/input"
import EPInText_ViewWeak from "@src/client/component/primitive/in-text/element/view_weak"
import st_intext from "@src/client/component/primitive/in-text/style/white.module.scss"
import EPSelectList_TmplIt from "@src/client/component/primitive/selectlist/element/tmplit"
import EPSelectList_TmplMt from "@src/client/component/primitive/selectlist/element/tmplmt"
import { domroot_dropdown } from "@src/client/const/domroot"
import { useRefO } from "@src/client/hook/ref/o"
import type { FnSetterStateful } from "@src/client/type/fns"
import cl from "classnames"
import * as r from "react"
import * as ri18 from "react-i18next"
import { v7 as uuid } from "uuid"

type EL_ActionPost_Props = {
    readonly selection: EFCon_NodeKind
    readonly paginator_data: sc.Signal<readonly EFCon_Paginator__DataNode[], readonly EFCon_Paginator__DataNode[]>
}

const EL_ActionPost: r.FC<EL_ActionPost_Props> = props => {
    const store = asr.useAtomStore()
    const dispatch = asr.useAtomDispatch()

    const ref_button = r.useRef<HTMLButtonElement | null>(null)
    const oref_button = useRefO(ref_button)

    const [open, open_set] = r.useState(false)

    return <ddn.CmpContainerVirtual open={open} open_set={open_set}>
        <ddn.CmpButtonVirtual target={oref_button}>
            <button
                ref={ref_button}

                className={st.action}

                onClick={() => {
                    const id = uuid()

                    switch (props.selection) {
                        case EFCon_NodeKind.Item: {
                            open_set(o => !o)

                            break
                        }
                        case EFCon_NodeKind.Material: {
                            open_set(o => !o)

                            break
                        }
                        case EFCon_NodeKind.ItemTemplate: {
                            dispatch(rem.tmplit.act.post({
                                body: [{
                                    core: {
                                        id,
                                        name: "tmplit",
                                        status_hidden: 1,
                                    },

                                    joins: {},
                                }],
                            }))

                            props.paginator_data.input([
                                {
                                    kind: EFCon_NodeKind.ItemTemplate as const,
                                    node: store.reg(rem.tmplit.register).reg({ id })
                                },
                                ...props.paginator_data.output()
                            ])

                            break
                        }
                        case EFCon_NodeKind.MaterialTemplate: {
                            dispatch(rem.tmplmt.act.post({
                                body: [{
                                    core: {
                                        id,
                                        name: "tmplmt",
                                        status_hidden: 1,
                                    },

                                    joins: {
                                    },
                                }]
                            }))

                            props.paginator_data.input([
                                {
                                    kind: EFCon_NodeKind.MaterialTemplate as const,
                                    node: store.reg(rem.tmplmt.register).reg({ id })

                                },
                                ...props.paginator_data.output()
                            ])

                            break
                        }
                        case EFCon_NodeKind.ProductTemplate: {
                            dispatch(rem.tmplpr.act.post({
                                body: [{
                                    core: {
                                        id,
                                        name: "tmplpr",
                                        status_hidden: 1,
                                        price_formula: "",
                                    },

                                    joins: {
                                    },
                                }]
                            }))

                            props.paginator_data.input([
                                {
                                    kind: EFCon_NodeKind.ProductTemplate as const,
                                    node: store.reg(rem.tmplpr.register).reg({ id })

                                },
                                ...props.paginator_data.output()
                            ])

                            break
                        }
                    }
                }}
            >
                <faw.FontAwesomeIcon icon={fas_plus.faPlus} className={st.action__icon} />
            </button>
        </ddn.CmpButtonVirtual>

        <ddn.CmpListPortal portal={domroot_dropdown} align={`center`} gap={5}>
            {() => {
                switch (props.selection) {
                    case EFCon_NodeKind.Item: {
                        return <ddn.CmpContent className={st.ddn__content}>
                            <EPSelectList_TmplIt
                                include_hidden={1}
                                include_private={1}

                                event_select={tmplit_ids => {
                                    const body = tmplit_ids.map(tmplit_id => {
                                        const id = uuid()

                                        return {
                                            core: {
                                                id,
                                                name: "",
                                                status_hidden: 1,
                                                tmplit__id: tmplit_id,
                                            },

                                            joins: {},
                                        }
                                    }) satisfies capi.SendRest_DataPost_Body<"item">

                                    dispatch(rem.item.act.post({ body, }))

                                    props.paginator_data.input([
                                        ...body.map(node => ({
                                            kind: EFCon_NodeKind.Item as const,
                                            node: store.reg(rem.item.register).reg({ id: node.core.id, })
                                        })),

                                        ...props.paginator_data.output()
                                    ])
                                }}
                            />
                        </ddn.CmpContent>
                    }
                    case EFCon_NodeKind.Material:
                        return <ddn.CmpContent className={st.ddn__content}>
                            <EPSelectList_TmplMt
                                include_hidden={1}
                                include_private={1}

                                event_select={tmplmt_ids => {
                                    const body = tmplmt_ids.map(tmplmt_id => {
                                        const id = uuid()

                                        return {
                                            core: {
                                                id,
                                                tmplmt__id: tmplmt_id,

                                                status_hidden: 1,
                                                status_available: 1,
                                            },

                                            joins: {
                                            },
                                        }
                                    }) satisfies capi.SendRest_DataPost_Body<"material">

                                    dispatch(rem.material.act.post({
                                        body: body
                                    }))

                                    props.paginator_data.input([
                                        ...body.map(node => ({
                                            kind: EFCon_NodeKind.Material as const,
                                            node: store.reg(rem.material.register).reg({ id: node.core.id, })
                                        })),

                                        ...props.paginator_data.output()
                                    ])
                                }}
                            />
                        </ddn.CmpContent>
                }

                return null
            }}
        </ddn.CmpListPortal>
    </ddn.CmpContainerVirtual>
}

export type EFCon__Filter_Props = {
    readonly selection: EFCon_NodeKind
    readonly selection_set: FnSetterStateful<EFCon_NodeKind>

    readonly search_default: string
    readonly search_set: (value: string) => void

    readonly paginator_data: sc.Signal<readonly EFCon_Paginator__DataNode[], readonly EFCon_Paginator__DataNode[]>
}

export const EFCon_Filter: r.FC<EFCon__Filter_Props> = props => {
    const { t } = ri18.useTranslation()

    const datalist = [
        EFCon_NodeKind.Item,
        EFCon_NodeKind.Material,
        EFCon_NodeKind.ItemTemplate,
        EFCon_NodeKind.ProductTemplate,
        EFCon_NodeKind.MaterialTemplate
    ] as const

    return <div className={st.container}>
        <div className={cl(st.sector, st.sector_select)}>
            <EPInOption_View
                kind_search

                status_disabled={false}
                placeholder={t(`console_list.placeholder_nodekind`)}

                theme={{
                    ...stheme_inoption_form,

                    head: cl(stheme_inoption_form.head, st.inoption__container)
                }}

                mask={datalist.reduce((acc, node) => {
                    const node_tl = t(`console_list.${node}`)

                    return acc.length > node_tl.length ? acc : node_tl
                }, "")}

                option_list={datalist}
                option_key_new={o => o}
                option_selection={[props.selection]}
                option_selection_set={props.selection_set}
                option_name_new={o => t(`console_list.${o}`)}
            />

            <EL_ActionPost paginator_data={props.paginator_data} selection={props.selection} />
        </div>

        <EPInText_ViewWeak
            stmod={st_intext}
            className={cl(st.intext)}
            value={props.search_default}
        >
            <EPInText_Input
                event_value_change={props.search_set}
            />

            <EPInText_IconView
                icon={fas_search.faMagnifyingGlass}
            />
        </EPInText_ViewWeak>
    </div>
}
