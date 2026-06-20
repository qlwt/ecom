import ELAccProfile_Nav from "@src/client/component/feature/acc-profile/local/nav"
import st from "@src/client/component/feature/acc-profile/style/page.module.scss"
import * as r from "react"
import * as rr from "react-router"
import * as ri18 from "react-i18next"
import { urlmap } from "@src/client/urlmap"

export const EFAccProfile_Page: r.FC = function() {
    const { t } = ri18.useTranslation()

    return <main className={st.page}>
        <ELAccProfile_Nav
            link_list={[
                {
                    name: t(`user.link_info`),
                    href: urlmap.shared.acc_info()
                },
                {
                    name: t(`user.link_commisions`),
                    href: urlmap.shared.acc_commision()
                },
                {
                    name: t(`user.link_contacts`),
                    href: urlmap.shared.acc_contact()
                },
            ]}
        />

        <rr.Outlet />
    </main>
}

export default EFAccProfile_Page
