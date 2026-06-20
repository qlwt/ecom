import * as cst from "@fst/cst"
import * as gs from "@fst/gstate"
import * as sxm from "@fst/syntax-math"
import * as rfl from "@qyu/reactcmp-flow-control"
import * as sx from "@qyu/syntax-core"
import EPCardImg_IconView from "@src/client/component/primitive/card-img/element/icon_view"
import EPCardImg_ImgView from "@src/client/component/primitive/card-img/element/img_view"
import EPCardImg_LayerFView from "@src/client/component/primitive/card-img/element/layerf_view"
import EPCardImg_LayoutMainCol from "@src/client/component/primitive/card-img/element/layout_maincol"
import EPCardImg_View from "@src/client/component/primitive/card-img/element/view"
import ELProduct_ArgBtnLine from "@src/client/component/primitive/product/local/argbtn_line"
import ELProduct_ArgBtnRect from "@src/client/component/primitive/product/local/argbtn_rect"
import ELProduct_ArgView from "@src/client/component/primitive/product/local/argview"
import { ELProduct_ArgViewBool } from "@src/client/component/primitive/product/local/argview_bool"
import { ELProduct_ArgViewMat } from "@src/client/component/primitive/product/local/argview_mat"
import ELProduct_Quantity from "@src/client/component/primitive/product/local/quantity"
import st from "@src/client/component/primitive/product/style/core.module.scss"
import { array_new_mapfilter } from "@src/client/util/array/new/mapfilter"
import { formula_hidden_new_tmplpr_arg } from "@src/client/util/formula_hidden/tmplpr_arg"
import { imgref_data_apiurl } from "@src/client/util/imgref/data/apiurl"
import { imgref_data_top } from "@src/client/util/imgref/data/top"
import { lang_prop } from "@src/client/util/tl/prop"
import cl from "classnames"
import * as r from "react"
import * as ri18 from "react-i18next"

export type EPProduct__View_Props = {
    readonly include_hidden: 1 | 0
    readonly include_private: 1 | 0
    readonly product: gs.Rem_JoinData<"product">

    readonly lang: string | null
    readonly lang_fallback: string | undefined

    readonly style_view?: boolean
    readonly hook_action?: () => boolean
}

export const EPProduct_View: r.FC<EPProduct__View_Props> = props => {
    const { t } = ri18.useTranslation()
    const ref_lastindex = r.useRef<number | null>(null)
    const cache_expr = r.useMemo(() => new Map<string, sx.Tree_Slot<sxm.TreeNode>>(), [])

    const img_src = imgref_data_apiurl(imgref_data_top(props.product.template.refimgs))

    const arg_list = r.useMemo(() => {
        return props.product.template.args.filter(arg => {
            return !formula_hidden_new_tmplpr_arg({
                arg,
                cache_expr,
                product: props.product,
            })
        })
    }, [props.product.template.args, props.product])

    const [argsel, argsel_set] = r.useState<string | null>(() => {
        for (let i = 0; i < arg_list.length; ++i) {
            const arg = arg_list[i]!

            switch (arg.kind) {
                case cst.TmplPrArg_Kind.Line: {
                    if (arg.defs_line[0]) {
                        ref_lastindex.current = i

                        return arg.id
                    }

                    break
                }
                case cst.TmplPrArg_Kind.Rect: {
                    if (arg.defs_rect[0]) {
                        ref_lastindex.current = i

                        return arg.id
                    }

                    break
                }
            }
        }

        return null
    })

    const arg_active = r.useMemo(() => {
        if (ref_lastindex.current !== null) {
            const arg = arg_list[ref_lastindex.current]

            if (arg && arg.id === argsel) {
                switch (arg.kind) {
                    case cst.TmplPrArg_Kind.Line: {
                        if (arg.defs_line[0]) { return arg }

                        break
                    }
                    case cst.TmplPrArg_Kind.Rect: {
                        if (arg.defs_rect[0]) { return arg }

                        break
                    }
                }
            }
        }

        for (let i = 0; i < arg_list.length; ++i) {
            const arg = arg_list[i]!

            if (arg.id === argsel) {
                switch (arg.kind) {
                    case cst.TmplPrArg_Kind.Line: {
                        if (arg.defs_line[0]) {
                            ref_lastindex.current = i

                            return arg
                        }

                        break
                    }
                    case cst.TmplPrArg_Kind.Rect: {
                        if (arg.defs_rect[0]) {
                            ref_lastindex.current = i

                            return arg
                        }

                        break
                    }
                }
            }
        }

        return null
    }, [arg_list, argsel])

    r.useLayoutEffect(() => {
        if (typeof argsel === "string") {
            if (ref_lastindex.current) {
                const arg = arg_list[ref_lastindex.current]

                if (arg && argsel === arg.id) {
                    switch (arg.kind) {
                        case cst.TmplPrArg_Kind.Line: {
                            if (arg.defs_line[0]) { return }

                            break
                        }
                        case cst.TmplPrArg_Kind.Rect: {
                            if (arg.defs_rect[0]) { return }

                            break
                        }
                    }
                }
            }

            let fallback: string | null = null

            for (let i = 0; i < arg_list.length; ++i) {
                const arg = arg_list[i]!

                switch (arg.kind) {
                    case cst.TmplPrArg_Kind.Line: {
                        if (arg.defs_line[0]) {
                            fallback ??= arg.id

                            if (argsel === arg.id) {
                                ref_lastindex.current = i

                                return
                            }
                        }

                        break
                    }
                    case cst.TmplPrArg_Kind.Rect: {
                        if (arg.defs_rect[0]) {
                            fallback ??= arg.id

                            if (argsel === arg.id) {
                                ref_lastindex.current = i

                                return
                            }
                        }

                        break
                    }
                }
            }

            argsel_set(fallback)
        }
    }, [arg_list])

    return <div className={st.root} data-kind={"EPProduct_View"}>
        <div className={cl(st.head)}>
            <EPCardImg_View className={st.head__preview}>
                <EPCardImg_LayerFView>
                    <rfl.CmpRequire
                        value={[img_src] as const}

                        fallback={() => {
                            return <EPCardImg_IconView icon={`image`} />
                        }}
                    >
                        {([img_srcdef]) => {
                            return <EPCardImg_ImgView {...img_srcdef} sizes={`30vw`} />
                        }}
                    </rfl.CmpRequire>
                </EPCardImg_LayerFView>
            </EPCardImg_View>

            <div className={st.head__title}>
                <h3 className={st.head__title__text}>
                    {lang_prop(props.product.template, props.lang, "name", props.lang_fallback)}
                </h3>
            </div>

            <div className={st.head__acts}>
                {/* <rfl.CmpIf value={!props.style_view}> */}
                {/*     {() => <EPAction_BtnToggle */}
                {/*         style_root */}
                {/*         icon={`eye_slash`} */}
                {/**/}
                {/*         className={st.topbar__action} */}
                {/*         state_active={props.product.status_hidden === 1} */}
                {/**/}
                {/*         event_click={() => { */}
                {/*             dispatch(rem.product.act.patch({ */}
                {/*                 body: { */}
                {/*                     id: props.product.id, */}
                {/**/}
                {/*                     patch: { */}
                {/*                         status_hidden: Number(!props.product.status_hidden) as 0 | 1, */}
                {/*                     }, */}
                {/*                 }, */}
                {/*             })) */}
                {/*         }} */}
                {/*     />} */}
                {/* </rfl.CmpIf> */}

                <div className={st.head__quantity}>
                    <ELProduct_Quantity
                        product_id={props.product.id}
                        product_quantity={props.product.quantity}

                        hook_action={props.hook_action ?? null}
                    />
                </div>
            </div>

            <div className={st.head__materials}>
                <rfl.CmpLoop data={arg_list}>
                    {arg => {
                        if (arg.kind === cst.TmplPrArg_Kind.Mat) {
                            const arg_mat = arg.defs_mat[0]

                            if (arg_mat) {
                                const imp_mat = props.product.argimps_mat.find(
                                    n => n.tmplpr_arg_mat__id === arg_mat.id
                                ) ?? null

                                return <ELProduct_ArgViewMat
                                    key={arg_mat.id}

                                    include_hidden={props.include_hidden}
                                    include_private={props.include_private}

                                    arg_mat={arg_mat}
                                    imp_mat={imp_mat}

                                    lang={props.lang}
                                    lang_fallback={props.lang_fallback}

                                    product_id={props.product.id}
                                    product_owner={props.product.owner}

                                    hook_action={props.hook_action ?? null}
                                />
                            }
                        }

                        return null
                    }}
                </rfl.CmpLoop>
            </div>
        </div>

        <rfl.CmpRequire
            state_empty={([args_bool]) => args_bool.length === 0}

            value={[array_new_mapfilter(arg_list, arg => {
                if (arg.kind === cst.TmplPrArg_Kind.Bool && arg.defs_bool[0]) {
                    return {
                        arg,
                        arg_bool: arg.defs_bool[0]!
                    }
                }

                return null
            })] as const}
        >
            {([args_bool]) => {
                return <div className={cl(st.line, st._argsbool)}>
                    <rfl.CmpLoop data={args_bool}>
                        {({ arg, arg_bool }) => {
                            const imp_bool = props.product.argimps_bool.find(
                                n => n.tmplpr_arg_bool__id === arg_bool.id
                            ) ?? null

                            return <ELProduct_ArgViewBool
                                key={arg.id}

                                arg_bool={arg_bool}
                                imp_bool={imp_bool}

                                lang={props.lang}
                                lang_fallback={props.lang_fallback}

                                product_id={props.product.id}
                                product_owner={props.product.owner}

                                hook_action={props.hook_action ?? null}
                            />
                        }}
                    </rfl.CmpLoop>
                </div>
            }}
        </rfl.CmpRequire>

        <div className={cl(st.argnav, st.line)}>
            <rfl.CmpLoop data={arg_list}>
                {arg => {
                    switch (arg.kind) {
                        case cst.TmplPrArg_Kind.Line: {
                            const arg_line = arg.defs_line[0]

                            if (arg_line) {
                                const imp_line = props.product.argimps_line.find(
                                    n => n.tmplpr_arg_line__id === arg_line.id
                                ) ?? null

                                return <ELProduct_ArgBtnLine
                                    key={arg.id}

                                    lang={props.lang}
                                    lang_fallback={props.lang_fallback}

                                    arg={arg}
                                    arg_line={arg_line}
                                    imp_line={imp_line}

                                    state_active_set={argsel_set}
                                    state_active={arg_active?.id === arg.id}
                                />
                            }

                            break
                        }
                        case cst.TmplPrArg_Kind.Rect: {
                            const arg_rect = arg.defs_rect[0]

                            if (arg_rect) {
                                const imp_rect = props.product.argimps_rect.find(
                                    n => n.tmplpr_arg_rect__id === arg_rect.id
                                ) ?? null

                                return <ELProduct_ArgBtnRect
                                    key={arg.id}

                                    lang={props.lang}
                                    lang_fallback={props.lang_fallback}

                                    arg={arg}
                                    arg_rect={arg_rect}
                                    imp_rect={imp_rect}

                                    state_active_set={argsel_set}
                                    state_active={arg_active?.id === arg.id}
                                />
                            }

                            break
                        }
                    }

                    return null
                }}
            </rfl.CmpLoop>
        </div>

        <div className={st.whitespace} />

        <div className={cl(st.argview, st.line)}>
            <rfl.CmpRequire
                value={[arg_active] as const}

                fallback={() => {
                    return <EPCardImg_View>
                        <EPCardImg_LayerFView>
                            <EPCardImg_LayoutMainCol>
                                <div className={st.argview__placeholder}>
                                    <h3 className={st.argview__placeholder__text}>
                                        {t("tmplpr.noparams")}
                                    </h3>
                                </div>
                            </EPCardImg_LayoutMainCol>
                        </EPCardImg_LayerFView>
                    </EPCardImg_View>
                }}
            >
                {([arg]) => <ELProduct_ArgView
                    key={arg.id}

                    arg={arg}
                    product={props.product}

                    lang={props.lang}
                    lang_fallback={props.lang_fallback}

                    hook_action={props.hook_action ?? null}
                />}
            </rfl.CmpRequire>
        </div>
    </div>
}

export default EPProduct_View
