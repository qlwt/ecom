import * as gs from "@fst/gstate"
import type { EFCon_NodeKind } from "@src/client/component/feature/console/cst/NodeKind"

export type EFCon_Paginator__Cursor = null | string

export type EFCon_Paginator__Limit = number

export type EFCon_Paginator__DataNode = (
    | {
        readonly kind: EFCon_NodeKind.Material
        readonly node: gs.Rem_Node<"material">
    }
    | {
        readonly kind: EFCon_NodeKind.Item
        readonly node: gs.Rem_Node<"item">
    }
    | {
        readonly kind: EFCon_NodeKind.ItemTemplate
        readonly node: gs.Rem_Node<"tmplit">
    }
    | {
        readonly kind: EFCon_NodeKind.MaterialTemplate
        readonly node: gs.Rem_Node<"tmplmt">
    }
    | {
        readonly kind: EFCon_NodeKind.ProductTemplate
        readonly node: gs.Rem_Node<"tmplpr">
    }
)

export type EFCon_Paginator__Search = Readonly<{
    filter: string
    kind: EFCon_NodeKind
}>

export type EFCon_Paginator = gs.PaginatorList<EFCon_Paginator__DataNode, EFCon_Paginator__Search, EFCon_Paginator__Limit>
