import * as fas_plus from "@fortawesome/free-solid-svg-icons/faPlus"
import * as faw from "@fortawesome/react-fontawesome"
import * as dbdef from "@fst/db-default"
import * as gs from "@fst/gstate"
import { rem } from "@fst/gstate"
import * as sxm from "@fst/syntax-math"
import * as asr from "@qyu/atom-state-react"
import * as ddn from "@qyu/reactcmp-dropdown"
import * as rfl from "@qyu/reactcmp-flow-control"
import * as sx from "@qyu/syntax-core"
import st from "@src/client/component/feature/console-edit/style/sec_variant.module.scss"
import EPAction_BtnClick from "@src/client/component/primitive/action/element/btn_click"
import EPAction_BtnSelectLang from "@src/client/component/primitive/action/element/btn_select_lang"
import EPAction_BtnToggle from "@src/client/component/primitive/action/element/btn_toggle"
import EPIcon_FA from "@src/client/component/primitive/icon/element/view"
import EPInText_Input from "@src/client/component/primitive/in-text/element/input"
import EPInText_ViewWeak from "@src/client/component/primitive/in-text/element/view_weak"
import st_intext from "@src/client/component/primitive/in-text/style/white.module.scss"
import EPInTextArea_Area from "@src/client/component/primitive/in-textarea/element/area"
import st_textarea from "@src/client/component/primitive/in-textarea/style/theme_white.module.scss"
import EPProduct_View from "@src/client/component/primitive/product/element/view"
import EPSelectList_TmplPr from "@src/client/component/primitive/selectlist/element/tmplpr"
import { domroot_dropdown } from "@src/client/const/domroot"
import { useMemoThrottle } from "@src/client/hook/memo_throttle"
import type { FnSetterStateles } from "@src/client/type/fns"
import { lang_prop } from "@src/client/util/tl/prop"
import { variant_price_new } from "@src/client/util/variant/price"
import cl from "classnames"
import * as r from "react"
import * as ri18 from "react-i18next"
import { v7 as uuid } from "uuid"

type EL_NavActionPost_Props = {
    readonly act_variant_post: () => VoidFunction
}

const EL_NavActionPost: r.FC<EL_NavActionPost_Props> = props => {
    return <button
        className={cl(
            st.nav__item,
            st.nav__item_post,
        )}

        onClick={() => {
            props.act_variant_post()()
        }}
    >
        <faw.FontAwesomeIcon icon={fas_plus.faPlus} />
    </button>
}

type EL_NavSelect_Props = {
    readonly node: gs.Rem_JoinData<"variant">

    readonly lang: string | null
    readonly state_selected: boolean
    readonly selection_set: (variant_id: string) => void
}

const EL_NavActionSelect: r.FC<EL_NavSelect_Props> = props => {
    const { t } = ri18.useTranslation()

    const header = lang_prop(props.node, props.lang, "header", "").trim()

    return <button
        disabled={props.state_selected}

        className={cl(
            st.nav__item,
            st.nav__item_select,
            props.state_selected && st.nav__item_select_selected
        )}

        onClick={() => {
            props.selection_set(props.node.id)
        }}
    >
        <EPIcon_FA def={props.node.status_hidden ? `eye_slash` : `eye_open`} />

        <rfl.CmpIf value={header.length === 0}>
            <span className={st.nav__item__placeholder}>
                {t("commons.noname")}
            </span>
        </rfl.CmpIf>

        <rfl.CmpIf value={header.length >= 1}>
            <span className={st.nav__item__content}>
                {header}
            </span>
        </rfl.CmpIf>
    </button>
}

type EL_Nav_Props = {
    readonly children?: r.ReactNode
}

const EL_Nav: r.FC<EL_Nav_Props> = props => {
    return <nav className={st.nav}>
        {props.children}
    </nav>
}

type EL_ProductPost_Props = {
    readonly prodset_id: string
}

const EL_ProductPost: r.FC<EL_ProductPost_Props> = props => {
    const ref_btn = r.useRef<HTMLButtonElement | null>(null)
    const oref_btn = r.useCallback(() => ref_btn.current, [])

    const dispatch = asr.useAtomDispatch()
    const [open, open_set] = r.useState(false)

    return <ddn.CmpContainerVirtual
        open={open}
        open_set={open_set}
        className={st.topbar__action}
    >
        <ddn.CmpButtonVirtual target={oref_btn}>
            <EPAction_BtnToggle
                ref={ref_btn}
                style_root

                icon={`post`}
                state_active={open}
                className={st.topbar__action}

                event_click={() => {
                    open_set(!open)
                }}
            />
        </ddn.CmpButtonVirtual>

        <ddn.CmpListPortal gap={5} portal={domroot_dropdown} align="center">
            <ddn.CmpContent className={st.ddn__content}>
                <EPSelectList_TmplPr
                    include_hidden={1}
                    include_private={1}

                    event_select={tmplpr_ids => {
                        const id = uuid()

                        for (const tmplpr_id of tmplpr_ids) {
                            dispatch(gs.rem.product.act.post({
                                body: [{
                                    core: {
                                        ...dbdef.table.product,

                                        id,
                                        owner: null,
                                        tmplpr__id: tmplpr_id,
                                        prodset__id: props.prodset_id,
                                    },

                                    joins: {},
                                }],
                            }))
                        }
                    }}
                />
            </ddn.CmpContent>
        </ddn.CmpListPortal>
    </ddn.CmpContainerVirtual>
}

type EL_ProductDelete_Props = {
    readonly variant_id: string
}

const EL_ProductDelete: r.FC<EL_ProductDelete_Props> = props => {
    const dispatch = asr.useAtomDispatch()

    return <EPAction_BtnClick
        style_root
        style_redclr

        icon={`trashcan`}
        className={st.topbar__action}

        event_click={() => {
            dispatch(gs.rem.variant.act.delete({
                body: {
                    ids: [props.variant_id],
                },
            }))
        }}
    />
}

type EL_MainGrid_Props = {
    readonly lang: string | null
    readonly prodset: gs.Rem_JoinData<"prodset">
}

const EL_MainGrid: r.FC<EL_MainGrid_Props> = props => {
    const { t } = ri18.useTranslation()

    const products = props.prodset.products

    return <>
        <rfl.CmpRequire
            value={[products] as const}
            state_empty={([products]) => products.length === 0}

            fallback={() => {
                return <div className={cl(st.main__grid, st.main__grid_empty)}>
                    <h1 className={st.main__grid__fallback}>
                        {t("item.variant_empty")}
                    </h1>
                </div>
            }}
        >
            {([products]) => {
                return <div className={cl(st.main__grid, st.main__grid_full)}>
                    <rfl.CmpLoop data={products}>
                        {product => {
                            return <EPProduct_View
                                key={product.id}

                                product={product}
                                include_hidden={1}
                                include_private={1}

                                lang={props.lang}
                                lang_fallback={""}
                            />
                        }}
                    </rfl.CmpLoop>
                </div>
            }}
        </rfl.CmpRequire>
    </>
}

type EL_Main_Props = {
    readonly lang: string | null
    readonly lang_set: FnSetterStateles<string | null>
    readonly variant: gs.Rem_JoinData<"variant"> | null
}

const EL_Main: r.FC<EL_Main_Props> = props => {
    const { t } = ri18.useTranslation()

    const dispatch = asr.useAtomDispatch()
    const cache_expr = r.useMemo(() => new Map<string, sx.Tree_Slot<sxm.TreeNode>>(), [])

    const price = useMemoThrottle({
        delay: 100,
        deps_upd: [props.variant],
        deps_force: [props.variant?.id],

        cb: () => {
            if (!props.variant) {
                return 0
            }

            return variant_price_new({
                variant: props.variant,
                cache_expr: cache_expr,
            })
        },
    })

    return <div className={cl(st.main, props.variant === null ? st.main_empty : st.main_full)}>
        <rfl.CmpIf value={props.variant === null}>
            <h1 className={st.main__fallback}>
                {t("item.variant_notsel")}
            </h1>
        </rfl.CmpIf>

        <rfl.CmpRequire value={[props.variant] as const}>
            {([variant]) => {
                return <>
                    <div className={st.main__head}>
                        <div className={st.main__actions}>
                            <EL_ProductDelete variant_id={variant.id} />
                            <EL_ProductPost prodset_id={variant.prodset__id} />

                            <EPAction_BtnSelectLang
                                style_root

                                value={props.lang}
                                event_change={props.lang_set}
                                className={st.topbar__action}
                            />

                            <EPAction_BtnToggle
                                style_root
                                icon={`eye_slash`}

                                className={st.topbar__action}
                                state_active={variant.status_hidden === 1}

                                event_click={() => {
                                    dispatch(rem.variant.act.patch({
                                        body: {
                                            id: variant.id,

                                            patch: {
                                                status_hidden: Number(!variant.status_hidden) as 0 | 1,
                                            },
                                        },
                                    }))
                                }}
                            />
                        </div>

                        <div className={st.main__price}>
                            {`${price.toString()}`} {t(`currency.uah`)}
                        </div>
                    </div>

                    <div className={st.main__header}>
                        <EPInText_ViewWeak
                            stmod={st_intext}
                            value={lang_prop(variant, props.lang, "header", "")}
                        >
                            <EPInText_Input
                                key={`${variant.id}`}

                                placeholder={t("item.placeholder_variant_name")}

                                event_value_change={value => {
                                    if (props.lang === null) {
                                        dispatch(gs.rem.variant.act.patch({
                                            body: {
                                                id: variant.id,

                                                patch: {
                                                    header: value,
                                                },
                                            },
                                        }))
                                    } else {
                                        for (const tlnode of variant.tl) {
                                            if (props.lang === tlnode.lang) {
                                                dispatch(rem.variant_tl.act.patch({
                                                    body: {
                                                        id: tlnode.id,

                                                        patch: {
                                                            tltable: {
                                                                ...tlnode.tltable,

                                                                header: value,
                                                            },
                                                        },
                                                    },
                                                }))

                                                return
                                            }
                                        }

                                        dispatch(gs.rem.variant_tl.act.post({
                                            body: [{
                                                core: {
                                                    ...dbdef.table.variant_tl,

                                                    id: uuid(),
                                                    owner: null,
                                                    lang: props.lang,
                                                    source__id: variant.id,

                                                    tltable: {
                                                        ...dbdef.table.variant_tl.tltable,

                                                        header: value,
                                                    },
                                                },

                                                joins: {},
                                            }],
                                        }))
                                    }
                                }}
                            />
                        </EPInText_ViewWeak>
                    </div>

                    <div className={st.main__description}>
                        <EPInTextArea_Area
                            key={`${variant.id}`}

                            rows={6}
                            stmod={st_textarea}
                            placeholder={t(`item.placeholder_variant_desc`)}
                            value_default={lang_prop(variant, props.lang, "description", "")}

                            event_value_change={value => {
                                if (props.lang === null) {
                                    dispatch(gs.rem.variant.act.patch({
                                        body: {
                                            id: variant.id,

                                            patch: {
                                                description: value,
                                            },
                                        },
                                    }))
                                } else {
                                    for (const tlnode of variant.tl) {
                                        if (props.lang === tlnode.lang) {
                                            dispatch(rem.variant_tl.act.patch({
                                                body: {
                                                    id: tlnode.id,

                                                    patch: {
                                                        tltable: {
                                                            ...tlnode.tltable,

                                                            description: value,
                                                        },
                                                    },
                                                },
                                            }))

                                            return
                                        }
                                    }

                                    dispatch(gs.rem.variant_tl.act.post({
                                        body: [{
                                            core: {
                                                ...dbdef.table.variant_tl,

                                                id: uuid(),
                                                owner: null,
                                                lang: props.lang,
                                                source__id: variant.id,

                                                tltable: {
                                                    ...dbdef.table.variant_tl.tltable,

                                                    description: value,
                                                },
                                            },

                                            joins: {},
                                        }],
                                    }))
                                }
                            }}
                        />
                    </div>

                    <EL_MainGrid prodset={variant.prodset} lang={props.lang} />
                </>
            }}
        </rfl.CmpRequire >
    </div>
}

export type ELConEdit__SecVariant_Props = {
    readonly item: gs.Rem_JoinData<"item">
}

export const ELConEdit_SecVariant: r.FC<ELConEdit__SecVariant_Props> = props => {
    const { i18n } = ri18.useTranslation()

    const ref_lastindex = r.useRef<number | null>(null)

    const dispatch = asr.useAtomDispatch()
    const [selection, selection_set] = r.useState<string | null>(null)

    const [lang, lang_set] = r.useState<null | string>(i18n.language)

    const variants = r.useMemo(() => {
        return props.item.variants.filter(variant => {
            if (variant.owner) {
                return false
            }

            return true
        })
    }, [props.item.variants])

    const variant_selected = r.useMemo(() => {
        if (selection === null) {
            return variants[0] || null
        }

        if (ref_lastindex.current !== null) {
            const variant = variants[ref_lastindex.current]

            if (variant && variant.id === selection) {
                return variant
            }
        }

        for (let i = 0; i < variants.length; ++i) {
            const variant = variants[i]!

            if (variant.id === selection) {
                ref_lastindex.current = i

                return variant
            }
        }

        return null
    }, [variants, selection])

    r.useLayoutEffect(() => {
        if (typeof selection === "string") {
            if (ref_lastindex.current !== null) {
                const variant = variants[ref_lastindex.current]

                if (variant && selection === variant.id) {
                    return
                }
            }

            for (let i = 0; i < variants.length; ++i) {
                const variant = variants[i]!

                if (selection === variant.id) {
                    ref_lastindex.current = i

                    return
                }
            }

            selection_set(null)
        }
    }, [variants])

    return <section className={st.root}>
        <EL_Nav>
            <EL_NavActionPost
                act_variant_post={() => {
                    return () => {
                        const id = uuid()
                        const prodset_id = uuid()

                        dispatch(gs.rem.variant.act.post({
                            body: [{
                                core: {
                                    ...dbdef.table.variant,

                                    id,
                                    owner: null,
                                    status_hidden: 1,
                                    item__id: props.item.id,
                                    prodset__id: prodset_id,
                                },

                                joins: {
                                    prodset: {
                                        core: {
                                            ...dbdef.table.prodset,

                                            owner: null,
                                            id: prodset_id,
                                        },

                                        joins: {},
                                    },
                                },
                            }]
                        }))
                    }
                }}
            />

            <rfl.CmpLoop data={variants}>
                {variant => {
                    return <EL_NavActionSelect
                        key={variant.id}

                        lang={lang}
                        node={variant}
                        selection_set={selection_set}
                        state_selected={variant_selected?.id === variant.id}
                    />
                }}
            </rfl.CmpLoop>
        </EL_Nav>

        <EL_Main
            variant={variant_selected}

            lang={lang}
            lang_set={lang_set}
        />
    </section>
}

export default ELConEdit_SecVariant
