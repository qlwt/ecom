import st from "@client/component/primitive/card-img/style/core.module.scss"
import * as ddn from "@qyu/reactcmp-dropdown"
import * as rfl from "@qyu/reactcmp-flow-control"
import { lang_prop, type Lang_Prop_TlNode } from "@src/client/util/tl/prop"
import cl from "classnames"
import * as r from "react"
import * as ri18 from "react-i18next"

type EL__TagView_Props = {
    readonly value: string
}

export type EPCardImg__Tagln_Tag = {
    readonly id: string
    readonly name: string
    readonly tl: readonly Lang_Prop_TlNode[]
}

export const EL_TagView: r.FC<EL__TagView_Props> = props => {
    return <div className={cl(st.tag, st.tag_view)}>
        <span className={st.tag_view__content}>
            {props.value}
        </span>
    </div>
}

export type EPCardImg__Tagln_Props = {
    readonly view_length: number
    readonly view_src: readonly EPCardImg__Tagln_Tag[]

    readonly className?: string
}

export const EPCardImg_Tagln = function (props: EPCardImg__Tagln_Props): r.ReactNode {
    const { i18n } = ri18.useTranslation()

    const unshown_length = props.view_src.length - props.view_length
    const shown_length = Math.min(props.view_length, props.view_src.length)

    const oneitem = shown_length === 1 && unshown_length === 0

    if (shown_length === 0) {
        return null
    }

    return <div className={cl(st.tagln, oneitem && st._oneitem, props.className)}>
        <rfl.CmpRepeat repeat={shown_length}>
            {index => {
                const tagdata = props.view_src[index]!

                return <EL_TagView
                    key={tagdata.id}

                    value={lang_prop(tagdata, i18n.language, "name")}
                />
            }}
        </rfl.CmpRepeat>

        <rfl.CmpIf value={shown_length === 1 && unshown_length === 0}>
            <div className={st.tag__placeholder} />
        </rfl.CmpIf>

        <rfl.CmpIf value={unshown_length > 0}>
            {() => {
                return <ddn.CmpContainer className={st.tag_expansion__container}>
                    <ddn.CmpButton className={cl(st.tag, st.tag_expansion)}>
                        +{unshown_length}
                    </ddn.CmpButton>

                    <ddn.CmpListFix gap={2} align="center">
                        <ddn.CmpContent className={st.tag_expansion__list}>
                            <div className={st.tag_expansion__tagln}>
                                <rfl.CmpRepeat repeat={unshown_length}>
                                    {index => {
                                        const tagdata = props.view_src[shown_length + index]!

                                        return <EL_TagView
                                            key={tagdata.id}

                                            value={tagdata.name}
                                        />
                                    }}
                                </rfl.CmpRepeat>

                                {/* <div className={st.tag__placeholder} /> */}
                            </div>
                        </ddn.CmpContent>
                    </ddn.CmpListFix>
                </ddn.CmpContainer>
            }}
        </rfl.CmpIf>
    </div>
}

export default EPCardImg_Tagln
