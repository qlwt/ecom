import { EFHeader_Console } from "@src/client/component/feature/header/element/console"
import * as r from "react"
import * as rr from "react-router"

export type EFLayout__Console_Props = {
    
}

export const EFLayout_Console: r.FC<EFLayout__Console_Props> = props => {
    return <>
        <EFHeader_Console />

        <rr.Outlet />
    </>
}

export default EFLayout_Console
