import { gv_report__state } from "@src/gv/report/internal/state";
import { GVReport_Kind, type GVReport_State } from "@src/gv/report/type/state";
import * as asc from "@qyu/atom-state-core"
import { v7 as uuid } from "uuid"

export const gv_report = {
    state: gv_report__state,

    act: {
        delete: (id: string): asc.AtomAction => {
            return ({ reg }) => {
                const state = reg(gv_report__state)
                const copy: GVReport_State[] = []

                for (const def of state.output()) {
                    if (def.id !== id) {
                        copy.push(def)
                    }
                }

                state.input(copy)
            }
        },

        push: (def: Omit<GVReport_State, "creation_date" | "id">): asc.AtomAction => {
            return ({ reg }) => {
                reg(gv_report.act.push_strict({
                    ...def,

                    id: uuid(),
                    creation_date: Date.now(),
                }))
            }
        },

        push_strict: (def: GVReport_State): asc.AtomAction => {
            return ({ reg }) => {
                const state = reg(gv_report__state)

                state.input([...state.output(), def])
            }
        },

        push_error: (def: Omit<GVReport_State, "creation_date" | "id" | "kind">): asc.AtomAction => {
            return ({ reg }) => {
                reg(gv_report.act.push({
                    ...def,

                    kind: GVReport_Kind.Error,
                }))
            }
        },

        push_info: (def: Omit<GVReport_State, "creation_date" | "id" | "kind">): asc.AtomAction => {
            return ({ reg }) => {
                reg(gv_report.act.push({
                    ...def,

                    kind: GVReport_Kind.Info,
                }))
            }
        },
    } as const,
} as const
