import st from "@client/component/feature/home-view/style/sec_variant.module.scss"
import * as gs from "@fst/gstate"
import * as rfl from "@qyu/reactcmp-flow-control"
import { useFHomeView_VariantActive } from "@src/client/component/feature/home-view/hook/variant_active"
import { ELHomeView_Modal_CustomVariant } from "@src/client/component/feature/home-view/local/sec_variant__modal"
import { ELHomeView_SecVariant_NewCustom_Grid, ELHomeView_SecVariant_NewCustom_Head } from "@src/client/component/feature/home-view/local/sec_variant__newcustom"
import { ELHomeView_SecVariant_Selection_Grid, ELSecView_SecVariant_Selection_Head } from "@src/client/component/feature/home-view/local/sec_variant__selection"
import { EFHomeView_ModalState } from "@src/client/component/feature/home-view/type/modalstate"
import { EFHomeView_Selection_ActName, EFHomeView_Selection_Kind } from "@src/client/component/feature/home-view/type/selection"
import EPIcon_FA from "@src/client/component/primitive/icon/element/view"
import { lang_prop } from "@src/client/util/tl/prop"
import cl from "classnames"
import * as r from "react"
import * as ri18 from "react-i18next"

type Data_Variant = gs.Rem_JoinData<"variant">

export type ELHomeView__SecVariant_Props = {
    readonly node: gs.Rem_JoinData<"item">
}

export const ELHomeView_SecVariant: r.FC<ELHomeView__SecVariant_Props> = props => {
    const { t, i18n } = ri18.useTranslation()
    const ref_view = r.useRef<HTMLDivElement | null>(null)

    const [product_undisc_count, product_undisc_count_set] = r.useState(2)
    const [variant_selection, variant_select, variant_active] = useFHomeView_VariantActive(props.node)
    const [modal, modal_set] = r.useState(EFHomeView_ModalState.None)

    const [variants_owned, variants_public] = r.useMemo(() => {
        const variant_owned = new Array<Data_Variant>()
        const variant_public = new Array<Data_Variant>()

        for (let i = 0; i < props.node.variants.length; ++i) {
            const variant = props.node.variants[i]!

            if (typeof variant.owner === "string") {
                variant_owned.push(variant)
            } else {
                variant_public.push(variant)
            }
        }

        return [variant_owned, variant_public] as const
    }, [props.node.variants])

    const selected_newcustom = (
        variant_selection.kind === EFHomeView_Selection_Kind.Act
        && variant_selection.name === EFHomeView_Selection_ActName.NewCustom
    )

    r.useEffect((): VoidFunction | void => {
        const view = ref_view.current

        if (view) {
            const control_abort = new AbortController()

            const update = () => {
                const products = view.querySelectorAll(`[data-kind="EPProduct_View"]`)
                const view_rect = view.getBoundingClientRect()
                const view_lowbound = view_rect.height + view_rect.top

                let undisc_count = 0

                for (const product of products) {
                    const product_rect = product.getBoundingClientRect()
                    const product_quarterbound = product_rect.height / 4 + product_rect.top

                    if (product_quarterbound > view_lowbound) {
                        undisc_count += 1
                    }
                }

                product_undisc_count_set(undisc_count)
            }

            view.addEventListener("scroll", () => {
                update()
            }, { signal: control_abort.signal })

            update()

            return () => {
                control_abort.abort()
            }
        }
    }, [variant_active?.prodset.products])

    return <section className={st.root}>
        <div className={st.sec_nav}>
            <button
                disabled={selected_newcustom}
                className={cl(st.sec_nav__item, selected_newcustom && st._active)}

                onClick={() => {
                    variant_select({
                        kind: EFHomeView_Selection_Kind.Act,
                        name: EFHomeView_Selection_ActName.NewCustom,
                    })
                }}
            >
                <span className={cl(st.sec_nav__item__content)}>
                    {t("item.make_custom_variant")}
                </span>
            </button>

            <rfl.CmpLoop data={variants_owned}>
                {(variant, i) => {
                    const header = lang_prop(variant, i18n.language, "header").trim()

                    return <button
                        key={variant.id}
                        disabled={variant_active?.id === variant.id}
                        className={cl(st.sec_nav__item, variant_active?.id === variant.id && st._active)}

                        onClick={() => {
                            variant_select({
                                kind: EFHomeView_Selection_Kind.Selection,
                                id: variant.id
                            })
                        }}
                    >
                        <span className={cl(st.sec_nav__item__content, header.length === 0 && st._placeholder)}>
                            {header}
                        </span>

                        &nbsp;

                        <span className={cl(st.sec_nav__item__content, st._placeholder)}>
                            #{(variants_owned.length - i).toString()}
                        </span>
                    </button>
                }}
            </rfl.CmpLoop>

            <rfl.CmpLoop data={variants_public}>
                {variant => {
                    const header = lang_prop(variant, i18n.language, "header").trim()

                    return <button
                        key={variant.id}
                        disabled={variant_active?.id === variant.id}
                        className={cl(st.sec_nav__item, variant_active?.id === variant.id && st._active)}

                        onClick={() => {
                            variant_select({
                                kind: EFHomeView_Selection_Kind.Selection,
                                id: variant.id
                            })
                        }}
                    >
                        <span className={cl(st.sec_nav__item__content, header.length === 0 && st._placeholder)}>
                            {header || t(`commons.noname`)}
                        </span>
                    </button>
                }}
            </rfl.CmpLoop>
        </div>

        <div className={st.sec_view__container}>
            <div ref={ref_view} className={cl(st.sec_view)}>
                <rfl.CmpIf value={product_undisc_count >= 1}>
                    {() => <button
                        className={st.undisc__root}

                        onClick={() => {
                            const view = ref_view.current

                            if (view) {
                                const product = view.querySelector(`[data-kind="EPProduct_View"]`)

                                if (product) {
                                    const product_rect = product.getBoundingClientRect()

                                    view.scrollTo({
                                        behavior: "smooth",
                                        top: view.scrollTop + product_rect.height,
                                    })
                                }
                            }
                        }}
                    >
                        <span className={st.undisc__text}>
                            {t("item.undiscovered_products", { count: product_undisc_count })}
                        </span>

                        <span className={st.undisc__icon}>
                            <EPIcon_FA def={`caret-bottom`} />
                        </span>
                    </button>}
                </rfl.CmpIf>

                <rfl.CmpRequire value={[variant_active] as const} state_empty={modal !== EFHomeView_ModalState.CustomVariant}>
                    {([variant_active]) => <ELHomeView_Modal_CustomVariant
                        modal_set={modal_set}
                        variant={variant_active}
                        variant_select={variant_select}
                    />}
                </rfl.CmpRequire>

                <rfl.CmpIf value={selected_newcustom}>
                    {() => <>
                        <ELHomeView_SecVariant_NewCustom_Head />

                        <ELHomeView_SecVariant_NewCustom_Grid
                            variant_select={variant_select}
                            variants_public={variants_public}
                        />
                    </>}
                </rfl.CmpIf>

                <rfl.CmpIf value={variant_selection.kind === EFHomeView_Selection_Kind.Selection}>
                    {() => <>
                        <ELSecView_SecVariant_Selection_Head
                            variant={variant_active}
                            variant_select={variant_select}

                            item_id={props.node.id}
                            item_name={props.node.name}
                            item_tl={props.node.tl}
                            item_imgs={props.node.refimgs}

                            tmplit_id={props.node.template.id}
                            tmplit_tl={props.node.template.tl}
                            tmplit_name={props.node.template.name}
                        />

                        <ELHomeView_SecVariant_Selection_Grid
                            modal_set={modal_set}
                            variant={variant_active}
                        />
                    </>}
                </rfl.CmpIf>
            </div>
        </div>
    </section>
}

export default ELHomeView_SecVariant
