import * as cst from "@fst/cst"
import * as gs from "@fst/gstate"
import * as rfl from "@qyu/reactcmp-flow-control"
import EPCardImg_LayerFView from "@src/client/component/primitive/card-img/element/layerf_view"
import EPCardImg_LayoutMainCol from "@src/client/component/primitive/card-img/element/layout_maincol"
import EPCardImg_View from "@src/client/component/primitive/card-img/element/view"
import { ELProduct_ArgViewLine } from "@src/client/component/primitive/product/local/argview_line"
import { ELProduct_ArgViewRect } from "@src/client/component/primitive/product/local/argview_rect"
import st from "@src/client/component/primitive/product/style/argview.module.scss"
import * as r from "react"

export type ELProduct__ArgView_Props = {
    readonly lang: string | null
    readonly lang_fallback: string | undefined

    readonly product: gs.Rem_JoinData<"product">
    readonly arg: gs.Rem_JoinData<"tmplpr_arg">

    readonly hook_action: (() => boolean) | null
}

export const ELProduct_ArgView: r.FC<ELProduct__ArgView_Props> = props => {
    const render = (children: r.ReactNode) => {
        return <EPCardImg_View className={st.arg__view}>
            <EPCardImg_LayerFView>
                <EPCardImg_LayoutMainCol className={st.arg}>
                    {children}
                </EPCardImg_LayoutMainCol>
            </EPCardImg_LayerFView>
        </EPCardImg_View>
    }

    return <>
        <rfl.CmpRequire value={[props.arg.defs_line[0]] as const} state_empty={props.arg.kind !== cst.TmplPrArg_Kind.Line}>
            {([arg_line]) => {
                const imp_line = props.product.argimps_line.find(
                    n => n.tmplpr_arg_line__id === arg_line.id
                ) ?? null

                return render(<ELProduct_ArgViewLine
                    key={props.arg.id}

                    arg_line={arg_line}
                    imp_line={imp_line}

                    lang={props.lang}
                    lang_fallback={props.lang_fallback}

                    product_id={props.product.id}
                    product_owner={props.product.owner}

                    hook_action={props.hook_action}
                />)
            }}
        </rfl.CmpRequire>

        <rfl.CmpRequire value={[props.arg.defs_rect[0]] as const} state_empty={props.arg.kind !== cst.TmplPrArg_Kind.Rect}>
            {([arg_rect]) => {
                const imp_rect = props.product.argimps_rect.find(
                    n => n.tmplpr_arg_rect__id === arg_rect.id
                ) ?? null

                return render(<ELProduct_ArgViewRect
                    key={props.arg.id}

                    lang={props.lang}
                    lang_fallback={props.lang_fallback}

                    arg_rect={arg_rect}
                    imp_rect={imp_rect}

                    product_id={props.product.id}
                    product_owner={props.product.owner}

                    hook_action={props.hook_action}
                />)
            }}
        </rfl.CmpRequire>
    </>
}

export default ELProduct_ArgView
