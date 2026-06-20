import * as fas_bars from "@fortawesome/free-solid-svg-icons/faBars"
import * as fas_caretup from "@fortawesome/free-solid-svg-icons/faCaretUp"
import * as faw from "@fortawesome/react-fontawesome"
import * as mdl from "@qyu/reactcmp-modal"
import ELHeader_ActAcc from "@src/client/component/feature/header/local/act_acc"
import ELHeader_ActCart from "@src/client/component/feature/header/local/act_cart"
import st from "@src/client/component/feature/header/style/nav.module.scss"
import bezier from "bezier-easing"
import cl from "classnames"
import * as r from "react"
import * as rr from "react-router"
import * as ri18 from "react-i18next"
import ELHeader_ActLang from "@src/client/component/feature/header/local/act_lang"
import { urlmap } from "@src/client/urlmap"

type ELHLink_Props = Readonly<{
    to: string

    children?: r.ReactNode
}>

const ELHLink: r.FC<ELHLink_Props> = props => {
    return <rr.Link to={props.to} className={st.nav__link}>
        {props.children}
    </rr.Link>
}

type ELVLink_Props = Readonly<{
    to: string

    children?: r.ReactNode
}>

const ELVLink: r.FC<ELVLink_Props> = props => {
    return <rr.Link to={props.to} className={st.mnav__link}>
        {props.children}
    </rr.Link>
}

export type EFHeader__Nav_Props = Readonly<{

}>

export const EFHeader_Nav: r.FC<EFHeader__Nav_Props> = function() {
    const { t } = ri18.useTranslation()

    const [mdl_show, mdl_show_set] = r.useState(false)

    return <header className={st.container}>
        <div className={cl(st.segment, st.segment_logo)}>
            <button className={st.bars} onClick={mdl_show_set.bind(null, b => !b)}>
                <faw.FontAwesomeIcon icon={fas_bars.faBars} className={st.action_icon} />
            </button>

            <mdl.CmpOverlayAnimated show={mdl_show}>
                <mdl.CmpFGAnimSlide
                    show_set={mdl_show_set}
                    animation_type="fromtop"
                    easing={bezier(0.71, 0.17, 0.73, 0.98)}
                    styles={{ foreground: st.mnav__foreground }}

                    close_onpress={false}
                >
                    <button className={st.mnav__topbar} onClick={mdl_show_set.bind(null, b => !b)}>
                        <faw.FontAwesomeIcon icon={fas_caretup.faCaretUp} className={st.action_icon} />
                    </button>

                    <div className={st.mnav__list}>
                        <ELVLink to={urlmap.shared.root()}>
                            {t(["nav.home"])}
                        </ELVLink>

                        <ELVLink to={urlmap.public.tracker()}>
                            {t(["nav.tracker"])}
                        </ELVLink>

                        <ELVLink to={urlmap.public.contact()}>
                            {t(["nav.contact"])}
                        </ELVLink>
                    </div>
                </mdl.CmpFGAnimSlide>
            </mdl.CmpOverlayAnimated>

            <rr.Link className={st.logo__link} to={`/`}>
                LogoName
            </rr.Link>
        </div>

        <nav className={cl(st.segment, st.segment_nav)}>
            <ELHLink to={urlmap.shared.root()}>
                {t(["nav.home"])}
            </ELHLink>

            <ELHLink to={urlmap.public.tracker()}>
                {t(["nav.tracker"])}
            </ELHLink>

            <ELHLink to={urlmap.public.contact()}>
                {t(["nav.contact"])}
            </ELHLink>
        </nav>

        <div className={cl(st.segment, st.segment_actions)}>
            <ELHeader_ActLang />
            <ELHeader_ActCart />
            <ELHeader_ActAcc />
        </div>
    </header>
}
