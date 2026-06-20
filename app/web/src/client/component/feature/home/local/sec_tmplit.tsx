import * as gs from "@fst/gstate"
import type { FnSetterStateles } from "@qyu/reactcmp-dropdown"
import * as rfl from "@qyu/reactcmp-flow-control"
import ELHome_CardTmplIt from "@src/client/component/feature/home/local/card_tmplit"
import st from "@src/client/component/feature/home/style/sec_tmplit.module.scss"
import * as r from "react"

export type ELHome_SecTmplIt__Props = {
    readonly selection: string | null
    readonly selection_set: FnSetterStateles<string | null>
    readonly tmplit_list: readonly gs.Rem_JoinData<"tmplit">[]
}

export const ELHome_SecTmplIt: r.FC<ELHome_SecTmplIt__Props> = props => {
    return <section className={st.root}>
        <rfl.CmpLoop data={props.tmplit_list}>
            {tmplit => {
                return <ELHome_CardTmplIt
                    key={tmplit.id}

                    node={tmplit}
                    state_selected_set={props.selection_set}
                    state_selected={tmplit.id === props.selection}
                />
            }}
        </rfl.CmpLoop>
    </section>
}

export default ELHome_SecTmplIt
