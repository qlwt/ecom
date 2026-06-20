import stheme_inoption_act from "@client/component/feature/header/style/act_lang.module.scss"
import { remx } from "@fst/gstate"
import * as asr from "@qyu/atom-state-react"
import EPInOption_View from "@src/client/component/primitive/in-option/element/view"
import { i18n_resources } from "@src/client/i18n/init"
import * as r from "react"
import * as ri18 from "react-i18next"

const languages = Object.keys(i18n_resources)

export type ELHeader__ActLang_Props = {

}

export const ELHeader_ActLang: r.FC<ELHeader__ActLang_Props> = props => {
    const { i18n } = ri18.useTranslation()

    asr.useAtomLoader({
        atomloader: remx.auth.loaders.check,
        params: []
    })

    return <EPInOption_View
        option_list={languages}
        theme={stheme_inoption_act}
        option_key_new={lang => lang}
        option_selection={[i18n.language]}
        option_name_new={lang => lang.toUpperCase()}
        option_selection_set={lang => i18n.changeLanguage(lang ?? "en")}

        mask={"ENG"}
        placeholder={"EN"}
        kind_search={false}
        status_disabled={false}
    />
}

export default ELHeader_ActLang
