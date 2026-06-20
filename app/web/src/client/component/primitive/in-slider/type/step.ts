import type { FnSetterStateles } from "@qyu/reactcmp-dropdown"

export type EPInSlider_StepAct = (
    | EPInSlider_BoundAct_Edit
)

export type EPInSlider_BoundAct_Edit = {
    readonly kind: "edit"
    readonly step_set: FnSetterStateles<number>
}
