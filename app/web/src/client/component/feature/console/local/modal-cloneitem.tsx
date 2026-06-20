import st from "@client/component/feature/console/style/modal-cloneitem.module.scss"
import stheme_intext_form from "@client/component/primitive/in-text/style/white.module.scss"
import stheme_intextarea_form from "@client/component/primitive/in-textarea/style/theme_white.module.scss"
import * as cc from "@fst/config/client"
import * as cst from "@fst/cst"
import * as gs from "@fst/gstate"
import { gv, rem } from "@fst/gstate"
import * as asr from "@qyu/atom-state-react"
import * as ddn from "@qyu/reactcmp-dropdown"
import * as rfl from "@qyu/reactcmp-flow-control"
import * as rmdl from "@qyu/reactcmp-modal"
import * as sc from "@qyu/signal-core"
import EPCardImg_Headln_Btn from "@src/client/component/primitive/card-img/element/headln__btn"
import EPCardImg_ImgView from "@src/client/component/primitive/card-img/element/img_view"
import EPCardImg_LayerFButton from "@src/client/component/primitive/card-img/element/layerf_button"
import EPCardImg_LayoutMainCol from "@src/client/component/primitive/card-img/element/layout_maincol"
import EPCardImg_View from "@src/client/component/primitive/card-img/element/view"
import { EPInText_BlockComment } from "@src/client/component/primitive/in-text/element/block_comment"
import { EPInText_IconView } from "@src/client/component/primitive/in-text/element/icon_view"
import EPInText_Input from "@src/client/component/primitive/in-text/element/input"
import EPInText_ViewWeak from "@src/client/component/primitive/in-text/element/view_weak"
import EPInTextArea_Area from "@src/client/component/primitive/in-textarea/element/area"
import EPSelectList_Material from "@src/client/component/primitive/selectlist/element/material"
import { domroot_dropdown } from "@src/client/const/domroot"
import { useRefO } from "@src/client/hook/ref/o"
import { i18n_resources } from "@src/client/i18n/init"
import type { FnSetterStateful, FnSetterStateles } from "@src/client/type/fns"
import { imgref_data_apiurl } from "@src/client/util/imgref/data/apiurl"
import { object_new_map } from "@src/client/util/object/new/map"
import { remclone_item_node } from "@src/client/util/remclone/item"
import type { RemClone_Variant_Params_Overries } from "@src/client/util/remclone/variant"
import cl from "classnames"
import * as r from "react"
import * as ri18 from "react-i18next"
import { v7 as uuid } from "uuid"

type MaterialMap = {
    [ID in string]: string
}

type VariantMap = {
    [ID in string]: {
        header: string
        langmap: LangMap
        description: string
    }
}

const languages = Object.keys(i18n_resources) as (keyof typeof i18n_resources)[]

type Language = (typeof languages)[number]

type LangMap = {
    [K in Language]: {
        [K in string]: string
    }
}

const langmap_new = function(): LangMap {
    const result: Partial<LangMap> = {}

    for (const lang of Object.keys(i18n_resources) as Language[]) {
        result[lang] = {}
    }

    return result as LangMap
}

const langmap_fill = function(tlmaps: LangMap, tls: cc.RemDef["item_tl"]["joins"]["core"][]): LangMap {
    for (const tl of tls) {
        if (tl.lang in tlmaps) {
            tlmaps[tl.lang as Language] = {
                ...tlmaps[tl.lang as Language],

                ...tl.tltable,
            }
        }
    }

    return tlmaps
}

const langmap_with = function(langmap: LangMap, lang: Language, key: string, value: string): LangMap {
    return {
        ...langmap,

        [lang]: {
            ...langmap[lang],

            [key]: value,
        }
    }
}

type EL__Material_Props = {
    readonly materialmap: MaterialMap
    readonly materialmap_set: FnSetterStateful<MaterialMap>
    readonly src_material: cc.RemDef["material"]["joins"]["core"]
    readonly templates: readonly cc.RemDef["tmplmt"]["joins"]["core"][]
}

const EL_Material: r.FC<EL__Material_Props> = props => {
    const node_id = props.materialmap[props.src_material.id] ?? props.src_material.id

    const ref_btn = r.useRef<HTMLButtonElement | null>(null)
    const refo_btn = useRefO(ref_btn)

    const node = asr.useAtomOutput(r.useCallback(({ reg }) => {
        return sc.osignal_new_pipe(
            reg(rem.material.joins.core())({
                id: node_id
            }),
            node => node?.data ?? null,
        )
    }, [node_id]))

    const img_srcdef = imgref_data_apiurl(node?.refimgs[0] ?? null)

    const [selection_open, selection_open_set] = r.useState(false)

    return <ddn.CmpContainerVirtual open={selection_open} open_set={selection_open_set}>
        <ddn.CmpButtonVirtual target={refo_btn}>
            <EPCardImg_View>
                <EPCardImg_LayerFButton
                    ref={ref_btn}

                    event_click={() => {
                        selection_open_set(n => !n)
                    }}
                >
                    <EPCardImg_LayoutMainCol>
                        <EPCardImg_ImgView {...img_srcdef} sizes={`60vw`} />
                    </EPCardImg_LayoutMainCol>
                </EPCardImg_LayerFButton>
            </EPCardImg_View>
        </ddn.CmpButtonVirtual>

        <ddn.CmpListPortal portal={domroot_dropdown} gap={2} align={`center`}>
            {() => <ddn.CmpContent className={st.ddncontent}>
                <EPSelectList_Material
                    include_hidden={1}
                    include_private={1}
                    templates={props.templates}

                    state_selected_new={id => {
                        return id === node_id
                    }}

                    event_select={([id]) => {
                        if (typeof id === "string") {
                            props.materialmap_set(materialmap => {
                                return {
                                    ...materialmap,

                                    [props.src_material.id]: id,
                                }
                            })
                        }
                    }}
                />
            </ddn.CmpContent>}
        </ddn.CmpListPortal>
    </ddn.CmpContainerVirtual>
}

type EL__VariantsNav_Props = {
    readonly variant_sel: string | null
    readonly variant_sel_set: (id: string) => void
    readonly variant_list: readonly cc.RemDef["variant"]["joins"]["core"][]
}

const EL_VariantsNav: r.FC<EL__VariantsNav_Props> = props => {
    return <div className={st.variant__nav}>
        <rfl.CmpLoop data={props.variant_list}>
            {variant => {
                const variant_active = variant.id === props.variant_sel

                return <button
                    key={variant.id}

                    disabled={variant_active}
                    className={cl(st.variant__btn, variant_active && st._active)}

                    onClick={() => {
                        props.variant_sel_set(variant.id)
                    }}
                >
                    {variant.header}
                </button>
            }}
        </rfl.CmpLoop>
    </div>
}

type EL__VariantView_Props = {
    readonly variantmap: VariantMap
    readonly variantmap_set: FnSetterStateful<VariantMap>
    readonly src_variant: cc.RemDef["variant"]["joins"]["core"]
}

const EL_VariantView: r.FC<EL__VariantView_Props> = props => {
    const { t } = ri18.useTranslation()

    const header = r.useMemo(() => {
        return props.variantmap[props.src_variant.id]?.header ?? props.src_variant.header
    }, [props.variantmap, props.src_variant])

    const description = r.useMemo(() => {
        return props.variantmap[props.src_variant.id]?.description ?? props.src_variant.description
    }, [props.variantmap, props.src_variant])

    const langmap = r.useMemo(() => {
        return props.variantmap[props.src_variant.id]?.langmap ?? langmap_fill(langmap_new(), props.src_variant.tl)
    }, [props.variantmap, props.src_variant])

    return <div className={st.variant__view}>
        <div className={st.variant__row}>
            <EPInText_ViewWeak
                value={header}
                stmod={stheme_intext_form}
            >
                <EPInText_IconView icon={`globe`} />

                <EPInText_Input
                    placeholder={t("cloneitem.placeholder_variant_header")}

                    event_value_change={l_header => {
                        props.variantmap_set(variantmap => {
                            return {
                                ...variantmap,

                                [props.src_variant.id]: {
                                    ...variantmap[props.src_variant.id] ?? {
                                        header,
                                        langmap,
                                        description,
                                    },

                                    header: l_header,
                                }
                            }
                        })
                    }}
                />
            </EPInText_ViewWeak>

            <EPInTextArea_Area
                rows={5}
                value_default={description}
                stmod={stheme_intextarea_form}
                placeholder={t("cloneitem.placeholder_variant_description")}

                event_value_change={l_description => {
                    props.variantmap_set(variantmap => {
                        return {
                            ...variantmap,

                            [props.src_variant.id]: {
                                ...variantmap[props.src_variant.id] ?? {
                                    header,
                                    langmap,
                                    description,
                                },

                                description: l_description,
                            }
                        }
                    })
                }}
            />
        </div>

        <rfl.CmpLoop data={languages}>
            {lang => {
                return <div key={lang} className={st.variant__row}>
                    <EPInText_ViewWeak
                        stmod={stheme_intext_form}
                        value={langmap[lang].header ?? ""}
                    >
                        <EPInText_BlockComment>
                            {lang.toUpperCase()}
                        </EPInText_BlockComment>

                        <EPInText_Input
                            placeholder={t("cloneitem.placeholder_variant_header")}

                            event_value_change={l_header => {
                                props.variantmap_set(variantmap => {
                                    return {
                                        ...variantmap,

                                        [props.src_variant.id]: {
                                            ...variantmap[props.src_variant.id] ?? {
                                                header,
                                                langmap,
                                                description,
                                            },

                                            langmap: langmap_with(langmap, lang, "header", l_header)
                                        }
                                    }
                                })
                            }}
                        />
                    </EPInText_ViewWeak>

                    <EPInTextArea_Area
                        rows={5}
                        stmod={stheme_intextarea_form}
                        value_default={langmap[lang].description ?? ""}
                        placeholder={t("cloneitem.placeholder_variant_description")}

                        event_value_change={l_description => {
                            props.variantmap_set(variantmap => {
                                return {
                                    ...variantmap,

                                    [props.src_variant.id]: {
                                        ...variantmap[props.src_variant.id] ?? {
                                            header,
                                            langmap,
                                            description,
                                        },

                                        langmap: langmap_with(langmap, lang, "description", l_description)
                                    }
                                }
                            })
                        }}
                    />
                </div>
            }}
        </rfl.CmpLoop>
    </div>
}

type EL__Variants_Props = {
    readonly variantmap: VariantMap
    readonly variantmap_set: FnSetterStateful<VariantMap>
    readonly variant_list: readonly cc.RemDef["variant"]["joins"]["core"][]
}

const EL_Variants: r.FC<EL__Variants_Props> = props => {
    const { t } = ri18.useTranslation()

    const [variant_sel, variant_sel_set] = r.useState(props.variant_list[0]?.id ?? null)

    const variant_active = r.useMemo(() => {
        if (variant_sel === null) {
            return props.variant_list[0] ?? null
        }

        for (const variant of props.variant_list) {
            if (variant.id === variant_sel) {
                return variant
            }
        }

        return null
    }, [props.variant_list, variant_sel])

    return <div className={st.row__variants}>
        <EL_VariantsNav
            variant_sel={variant_sel}
            variant_sel_set={variant_sel_set}
            variant_list={props.variant_list}
        />

        <rfl.CmpRequire
            value={[variant_active] as const}

            fallback={() => {
                return <div className={st.variant__placeholder}>
                    <h2 className={st.variant__placeholder__text}>
                        {t("cloneitem.variant_notselected")}
                    </h2>
                </div>
            }}
        >
            {([variant_active]) => {
                return <EL_VariantView
                    src_variant={variant_active}
                    variantmap={props.variantmap}
                    variantmap_set={props.variantmap_set}
                />
            }}
        </rfl.CmpRequire>
    </div>
}

type MaterialBulk = {
    material: cc.RemDef["material"]["joins"]["core"]
    templates: cc.RemDef["tmplmt"]["joins"]["core"][]
}

export type ELCon_ModalCloneItem_Props = {
    readonly open: boolean
    readonly open_set: FnSetterStateles<boolean>
    readonly src_node: cc.RemDef["item"]["joins"]["core"]

    readonly event_addnode?: (node: gs.Rem_Node<"item">) => void
}

export const ELCon_ModalCloneItem: r.FC<ELCon_ModalCloneItem_Props> = props => {
    const { t } = ri18.useTranslation()
    const store = asr.useAtomStore()
    const dispatch = asr.useAtomDispatch()

    const [name, name_set] = r.useState(props.src_node.name)
    const [langmap, langmap_set] = r.useState(() => langmap_fill(langmap_new(), props.src_node.tl))

    const [variantmap, variantmap_set] = r.useState<VariantMap>({})
    const [materialmap, materialmap_set] = r.useState<MaterialMap>({})

    const src_node_variants = r.useMemo(() => {
        return props.src_node.variants.filter(variant => {
            return variant.owner === null
        })
    }, [props.src_node.variants])

    const src_material_bulks = r.useMemo(() => {
        const material_bulks = new Array<MaterialBulk>()

        for (const variant of src_node_variants) {
            for (const product of variant.prodset.products) {
                for (const arg of product.template.args) {
                    const argmat = arg.defs_mat[0]

                    if (arg.kind === cst.TmplPrArg_Kind.Mat && argmat) {
                        const imp = product.argimps_mat.find(imp => imp.tmplpr_arg_mat__id === argmat.id)

                        if (imp && imp.value) {
                            const material = imp.value
                            const repeat_index = material_bulks.findIndex(n => n.material.id === material.id)

                            if (repeat_index === -1) {
                                material_bulks.push({
                                    material,
                                    templates: argmat.perms.map(perm => perm.template)
                                })
                            } else {
                                const repeat_bulk = material_bulks[repeat_index]!

                                repeat_bulk.templates = repeat_bulk.templates.filter(template => {
                                    return argmat.perms.some(perm => perm.tmplmt__id === template.id)
                                })
                            }
                        }
                    }
                }
            }
        }

        return material_bulks
    }, [props.src_node])

    return <rmdl.CmpOverlayAnimated show={props.open} animation_velocity={4e-3}>
        <rmdl.CmpFGAnimFade show_set={props.open_set}>
            <div className={st.form}>
                <div className={st.field}>
                    <label className={st.label}>
                        {t("cloneitem.label_item_name")}
                    </label>

                    <div className={st.row__names}>
                        <EPInText_ViewWeak
                            value={name}
                            stmod={stheme_intext_form}
                        >
                            <EPInText_IconView icon={`globe`} />

                            <EPInText_Input
                                event_value_change={name_set}

                                placeholder={t("cloneitem.placeholder_item_name")}
                            />
                        </EPInText_ViewWeak>

                        <rfl.CmpLoop data={languages}>
                            {lang => {
                                return <EPInText_ViewWeak
                                    key={lang}
                                    stmod={stheme_intext_form}
                                    value={langmap[lang].name ?? ""}
                                >
                                    <EPInText_BlockComment>
                                        {lang.toUpperCase()}
                                    </EPInText_BlockComment>

                                    <EPInText_Input
                                        event_value_change={name => {
                                            langmap_set(name_tl => langmap_with(name_tl, lang, "name", name))
                                        }}
                                    />
                                </EPInText_ViewWeak>
                            }}
                        </rfl.CmpLoop>
                    </div>
                </div>

                <rfl.CmpIf value={src_material_bulks.length > 0}>
                    {() => <div className={st.field}>
                        <label className={st.label}>
                            {t("cloneitem.label_materials")}
                        </label>

                        <div className={st.row__materials}>
                            <rfl.CmpLoop data={src_material_bulks}>
                                {material_bulk => <rfl.CmpIf
                                    key={material_bulk.material.id}
                                    value={material_bulk.templates.length > 0}
                                >
                                    {() => <EL_Material
                                        materialmap={materialmap}
                                        materialmap_set={materialmap_set}

                                        src_material={material_bulk.material}
                                        templates={material_bulk.templates}
                                    />}
                                </rfl.CmpIf>}
                            </rfl.CmpLoop>
                        </div>
                    </div>}
                </rfl.CmpIf>

                <rfl.CmpIf value={src_node_variants.length}>
                    <div className={st.field}>
                        <label className={st.label}>
                            {t("cloneitem.label_variants")}
                        </label>

                        <EL_Variants
                            variantmap={variantmap}
                            variantmap_set={variantmap_set}
                            variant_list={src_node_variants}
                        />
                    </div>
                </rfl.CmpIf>

                <div className={st.row__submit}>
                    <EPCardImg_Headln_Btn
                        event_click={() => {
                            const item_id = uuid()

                            dispatch(rem.item.act.post({
                                body: [remclone_item_node({
                                    src: props.src_node,

                                    overrides: {
                                        owner: null,

                                        item_id,
                                        item_name: name,
                                        status_hidden: 1,

                                        item_tl: languages.map(lang => {
                                            return {
                                                lang,
                                                tltable: langmap[lang]
                                            }
                                        }),

                                        materialmap,

                                        variantmap: object_new_map(variantmap, variant_overrides => {
                                            return {
                                                owner: null,
                                                status_hidden: 0,
                                                variant_header: variant_overrides.header,
                                                variant_description: variant_overrides.description,

                                                tl: languages.map(lang => {
                                                    return {
                                                        lang,
                                                        tltable: variant_overrides.langmap[lang]
                                                    }
                                                }),
                                            } satisfies RemClone_Variant_Params_Overries
                                        })
                                    },
                                })],

                                config: {
                                    events: {
                                        success: () => {
                                            props.open_set(false)

                                            props.event_addnode?.(
                                                store.reg(rem.item.register).reg({
                                                    id: item_id,
                                                })
                                            )
                                        },

                                        failure: () => {
                                            dispatch(gv.report.act.push_error({
                                                text: t("popups.error.cloneitem_default")
                                            }))
                                        },
                                    },
                                }
                            }))
                        }}
                    >
                        {t("commons.submit")}
                    </EPCardImg_Headln_Btn>
                </div>
            </div>
        </rmdl.CmpFGAnimFade>
    </rmdl.CmpOverlayAnimated >
}

export default ELCon_ModalCloneItem
