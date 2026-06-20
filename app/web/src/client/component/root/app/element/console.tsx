import { remx } from "@fst/gstate"
import * as asr from "@qyu/atom-state-react"
import * as mdl from "@qyu/reactcmp-modal"
import EFAccProfile_Page from "@src/client/component/feature/acc-profile/element/page"
import EFAccProfile_ViewCommision from "@src/client/component/feature/acc-profile/element/view_commision"
import EFAccProfile_ViewContact from "@src/client/component/feature/acc-profile/element/view_contact"
import EFAccProfile_ViewInfo from "@src/client/component/feature/acc-profile/element/view_info"
import EFCommision_PageFinish from "@src/client/component/feature/commision/element/page_finish"
import EFCommision_PageView from "@src/client/component/feature/commision/element/page_view"
import EFConCommisions_Page from "@src/client/component/feature/console-commisions/element/page"
import EFConContacts_Page from "@src/client/component/feature/console-contacts/element/page"
import EFConEdit_PageItem from "@src/client/component/feature/console-edit/element/page_item"
import EFConEdit_PageMaterial from "@src/client/component/feature/console-edit/element/page_material"
import EFConEdit_PageTmplIt from "@src/client/component/feature/console-edit/element/page_tmplit"
import EFConEdit_PageTmplMt from "@src/client/component/feature/console-edit/element/page_tmplmt"
import EFConEdit_PageTmplPr from "@src/client/component/feature/console-edit/element/page_tmplpr"
import { EFCon } from "@src/client/component/feature/console/element"
import EFLayout_Console from "@src/client/component/feature/layout/element/console"
import EFSign_PagePassRestoreFill from "@src/client/component/feature/sign/element/page_passrestore_fill"
import { EFSign_PagePassRestoreSend } from "@src/client/component/feature/sign/element/page_passrestore_send"
import EFSign_PageSignIn from "@src/client/component/feature/sign/element/page_signin"
import EFSign_PageSignUp from "@src/client/component/feature/sign/element/page_signup"
import EFStatusPage_NotFound from "@src/client/component/feature/status-page/element/page_notfound"
import EPReport_View from "@src/client/component/primitive/report/element/view"
import st from "@src/client/component/root/app/style/index.module.scss"
import { urlmap } from "@src/client/urlmap"
import * as r from "react"
import * as rr from "react-router"

export const ER_AppConsole: r.FC = function() {
    const ref_page = r.useRef<HTMLDivElement | null>(null)
    const layertop = mdl.useLayerStackTop({ active: true, exists: true, z: -1 })

    asr.useAtomLoader({
        atomloader: remx.auth.loaders.check,
        params: []
    })

    mdl.useFocusCapture({
        active: layertop,
        target_new: () => ref_page.current
    })

    r.useLayoutEffect((): VoidFunction | void => {
        if (!layertop) {
            document.body.classList.add(st.body_noscroll!)

            return () => {
                document.body.classList.remove(st.body_noscroll!)
            }
        }
    }, [layertop])

    return <div ref={ref_page} aria-hidden={`${!layertop}`} className={st.page}>
        <EPReport_View />

        <rr.Routes>
            <rr.Route path="/" element={<EFLayout_Console />}>
                <rr.Route path={urlmap.console.contacts()} element={<EFConContacts_Page />} />
                <rr.Route path={urlmap.console.commisions()} element={<EFConCommisions_Page />} />
                <rr.Route path={urlmap.console.edit_item(null)} element={<EFConEdit_PageItem />} />
                <rr.Route path={urlmap.console.edit_tmplit(null)} element={<EFConEdit_PageTmplIt />} />
                <rr.Route path={urlmap.console.edit_tmplmt(null)} element={<EFConEdit_PageTmplMt />} />
                <rr.Route path={urlmap.console.edit_tmplpr(null)} element={<EFConEdit_PageTmplPr />} />
                <rr.Route path={urlmap.console.edit_material(null)} element={<EFConEdit_PageMaterial />} />

                <rr.Route path={urlmap.shared.root()} element={<EFCon />} />
                <rr.Route path={urlmap.shared.sign_in()} element={<EFSign_PageSignIn />} />
                <rr.Route path={urlmap.shared.sign_up()} element={<EFSign_PageSignUp />} />
                <rr.Route path={urlmap.shared.sign_restorepass_send()} element={<EFSign_PagePassRestoreSend />} />
                <rr.Route path={urlmap.shared.sign_restorepass_fill()} element={<EFSign_PagePassRestoreFill />} />
                <rr.Route path={urlmap.shared.commision_finish()} element={<EFCommision_PageFinish />} />
                <rr.Route path={urlmap.shared.commision_view(null)} element={<EFCommision_PageView />} />

                <rr.Route path={urlmap.shared.acc()} element={<EFAccProfile_Page />}>
                    <rr.Route path={urlmap.shared.acc_info()} element={<EFAccProfile_ViewInfo />} />
                    <rr.Route path={urlmap.shared.acc_contact()} element={<EFAccProfile_ViewContact />} />
                    <rr.Route path={urlmap.shared.acc_commision()} element={<EFAccProfile_ViewCommision />} />
                </rr.Route>

                <rr.Route path={`*`} element={<EFStatusPage_NotFound />} />
            </rr.Route>
        </rr.Routes>
    </div>
}
