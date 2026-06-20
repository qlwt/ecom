import { remx } from "@fst/gstate"
import * as asr from "@qyu/atom-state-react"
import * as mdl from "@qyu/reactcmp-modal"
import EFHomeView_PageItem from "@src/client/component/feature/home-view/element/page_item"
import EFHome_Page from "@src/client/component/feature/home/element/page"
import EFLayout_View from "@src/client/component/feature/layout/element/view"
import EFPingMe_View from "@src/client/component/feature/pingme/element/view"
import EFSign_PagePassRestoreFill from "@src/client/component/feature/sign/element/page_passrestore_fill"
import EFSign_PagePassRestoreSend from "@src/client/component/feature/sign/element/page_passrestore_send"
import EFSign_PageSignIn from "@src/client/component/feature/sign/element/page_signin"
import EFSign_PageSignUp from "@src/client/component/feature/sign/element/page_signup"
import EFStatusPage_NotFound from "@src/client/component/feature/status-page/element/page_notfound"
import EPReport_View from "@src/client/component/primitive/report/element/view"
import st from "@src/client/component/root/app/style/index.module.scss"
import { urlmap } from "@src/client/urlmap"
import * as r from "react"
import * as rr from "react-router"

const EFAccProfile_Page = r.lazy(() => import("@src/client/component/feature/acc-profile/element/page"))
const EFAccProfile_ViewInfo = r.lazy(() => import("@src/client/component/feature/acc-profile/element/view_info"))
const EFAccProfile_ViewContact = r.lazy(() => import("@src/client/component/feature/acc-profile/element/view_contact"))
const EFAccProfile_ViewCommision = r.lazy(() => import("@src/client/component/feature/acc-profile/element/view_commision"))

const EFTracker_Page = r.lazy(() => import("@src/client/component/feature/tracker/element/page"))
const EFContact_Page = r.lazy(() => import("@src/client/component/feature/contact/element/page_send"))
const EFCommision_PageView = r.lazy(() => import("@src/client/component/feature/commision/element/page_view"))
const EFCommision_PageFinish = r.lazy(() => import("@src/client/component/feature/commision/element/page_finish"))

export const ER_AppPublic: r.FC = function() {
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
        <EFPingMe_View />

        <rr.Routes>
            <rr.Route path="/" element={<EFLayout_View />}>
                <rr.Route path={urlmap.public.view_item(null)} element={<EFHomeView_PageItem />} />
                <rr.Route path={urlmap.public.tracker()} element={<EFTracker_Page />} />
                <rr.Route path={urlmap.public.contact()} element={<EFContact_Page />} />

                <rr.Route path={urlmap.shared.root()} element={<EFHome_Page />} />
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
