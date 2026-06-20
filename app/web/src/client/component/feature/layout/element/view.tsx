import { EFHeader_Nav } from "@src/client/component/feature/header/element/nav"
import * as r from "react"
import * as rr from "react-router"

export type EFLayout__View_Props = {
    
}

export const EFLayout_View: r.FC<EFLayout__View_Props> = props => {
    return <>
        <EFHeader_Nav />

        <rr.Outlet />
    </>
}

export default EFLayout_View
