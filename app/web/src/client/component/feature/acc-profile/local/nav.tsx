import st from "@src/client/component/feature/acc-profile/style/nav.module.scss"
import * as r from "react"
import * as rfl from "@qyu/reactcmp-flow-control"
import * as rr from "react-router"
import cl from "classnames"

export type ELAccProfile_Nav_Link = {
    readonly href: string
    readonly name: string
}

export type ELAccProfile_Nav_Props = {
    readonly link_list: readonly ELAccProfile_Nav_Link[]
}

export const ELAccProfile_Nav: r.FC<ELAccProfile_Nav_Props> = props => {
    return <nav className={st.root}>
        <rfl.CmpLoop data={props.link_list}>
            {link => {
                return <rr.NavLink
                    key={link.href}

                    to={link.href}
                    className={l_props => cl(st.link, l_props.isActive && st._active)}
                >
                    {link.name}
                </rr.NavLink>
            }}
        </rfl.CmpLoop>
    </nav>
}

export default ELAccProfile_Nav
