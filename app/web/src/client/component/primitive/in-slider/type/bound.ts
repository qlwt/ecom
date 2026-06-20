import type { FnSetterStateles } from "@qyu/reactcmp-dropdown"

export type EPInSlider_BoundDef = {
    readonly value_view: number
    readonly value_real: number
}

export type EPInSlider_BoundAct = (
    | EPInSlider_BoundAct_Click
    | EPInSlider_BoundAct_Edit
)

export type EPInSlider_BoundAct_Click = {
    readonly kind: "click"
}

export type EPInSlider_BoundAct_Edit = {
    readonly kind: "edit"
    readonly value_min_set: FnSetterStateles<number>
    readonly value_max_set: FnSetterStateles<number>
}
