export enum EFHomeView_Selection_Kind {
    Act,
    Selection
}

export enum EFHomeView_Selection_ActName {
    NewCustom
}

export type EFHomeView_Selection = (
    | {
        readonly kind: EFHomeView_Selection_Kind.Act
        readonly name: EFHomeView_Selection_ActName
    }
    | {
        readonly kind: EFHomeView_Selection_Kind.Selection
        readonly id: string | null
    }
)
