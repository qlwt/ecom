export type EPInSlider_MarkDef_Tl = {
    readonly id: string
    readonly lang: string
    readonly tltable: Record<string, string>
}

export type EPInSlider_MarkDef<Prefix extends string> = (
    & {
        readonly id: string
        readonly label: string
        readonly tl: readonly EPInSlider_MarkDef_Tl[]
    }
    & {
        readonly [K in `${Prefix}value`]: number
    }
)

export type EPInSlider_MarkAct<Prefix extends string> = (
    | EPInSlider_MarkAct_Click<Prefix>
    | EPInSlider_MarkAct_Edit<Prefix>
)

export type EPInSlider_MarkAct_Click<Prefix extends string> = {
    readonly kind: "click"
}

export type EPInSlider_MarkAct_Edit<Prefix extends string> = (
    & {
        readonly kind: "edit"
        readonly delete: (id: string) => void
        readonly label_set: (id: string, label: string) => void
    }
    & {
        readonly [K in `${Prefix}value_set`]: (id: string, value: number) => void
    }
)
