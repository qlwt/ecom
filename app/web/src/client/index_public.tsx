import "./index.scss"
import "@client/i18n/init"

import * as asc from "@qyu/atom-state-core"
import * as asr from "@qyu/atom-state-react"
import "@qyu/reactcmp-dropdown/style/index.css"
import * as mdl from "@qyu/reactcmp-modal"
import "@qyu/reactcmp-modal/style/index.global"
import { ER_AppPublic } from "@src/client/component/root/app/element/public"
import { domroot_app, domroot_dropdown, domroot_modal } from "@src/client/const/domroot"
import * as rdomc from "react-dom/client"
import * as rr from "react-router"
import * as r from "react"

document.body.append(domroot_app)
document.body.append(domroot_modal)
document.body.append(domroot_dropdown)

const root = rdomc.createRoot(domroot_app)

const store = asc.atomstore_new()

root.render(
    <r.StrictMode>
        <asr.AtomStoreContext value={store}>
            <mdl.CmpContextLayersFilled>
                <rr.BrowserRouter>
                    <ER_AppPublic />
                </rr.BrowserRouter>
            </mdl.CmpContextLayersFilled>
        </asr.AtomStoreContext>
    </r.StrictMode>
)
