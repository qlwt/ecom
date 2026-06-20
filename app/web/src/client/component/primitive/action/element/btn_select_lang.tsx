import type { FnSetterStateles } from "@qyu/reactcmp-dropdown"
import EPAction_BtnSelect from "@src/client/component/primitive/action/element/btn_select"
import EPIcon_FA from "@src/client/component/primitive/icon/element/view"
import { i18n_resources } from "@src/client/i18n/init"
import * as r from "react"

const languages = Object.keys(i18n_resources)

export type EPAction__BtnSelectLang_Props = {
    readonly value: string | null
    readonly event_change: FnSetterStateles<string | null>

    readonly style_root?: boolean
    readonly style_redclr?: boolean
    readonly style_nofallback?: boolean
    readonly style_shadow_type?: "normal" | "none"

    readonly className?: string
}

export const EPAction_BtnSelectLang: r.FC<EPAction__BtnSelectLang_Props> = props => {
    return <EPAction_BtnSelect
        {...props}

        option_fallback={<EPIcon_FA def={`globe`} />}

        option_list={languages.map(lang => ({
            id: lang,
            children: lang.toUpperCase(),
        }))}
    />
}

export default EPAction_BtnSelectLang
