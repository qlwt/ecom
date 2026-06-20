import * as gs from "@fst/gstate"
import * as sxs from "@fst/syntax-search"
import * as asc from "@qyu/atom-state-core"
import { EFCon_NodeKind } from "@src/client/component/feature/console/cst/NodeKind"
import type { EFCon_Paginator__Cursor, EFCon_Paginator__DataNode, EFCon_Paginator__Limit, EFCon_Paginator__Search } from "@src/client/component/feature/console/type/paginator"

const expr_new = function(src: string) {
    if (src.trim() === "") {
        return null
    }

    return sxs.expr_parse_safe(src) ?? null
}

export const efcon_paginator_new = function(store: asc.AtomStore, kind: EFCon_NodeKind, filter: string) {
    return gs.paginator_new_list<
        EFCon_Paginator__DataNode,
        EFCon_Paginator__Search,
        EFCon_Paginator__Cursor,
        EFCon_Paginator__Limit
    >({
        init: {
            data: [],
            cursor: null as null | string,
        },

        config: {
            retrydelay: 5000,

            search: {
                kind,
                filter
            },
        },

        request_new: api => {
            return new Promise((res, rej) => {
                switch (api.search.kind) {
                    case EFCon_NodeKind.Item: store.reg(gs.rem.item.act.get({
                        query: {
                            limit: api.limit,
                            cursor: api.cursor ?? null,

                            include_hidden: 1,
                            filter_tag__id: null,
                            pick_tmplit__id: null,
                            pick_owner: ["null-private"],
                            search: expr_new(api.search.filter),
                        },

                        config: {
                            signal_abort: api.signal_abort,

                            events: {
                                failure: reason => {
                                    rej(reason)
                                },

                                success: data => {
                                    api.data.input([
                                        ...api.data.output(),

                                        ...(data.slice.item?.nodes ?? []).map(n => {
                                            return {
                                                kind: EFCon_NodeKind.Item as const,
                                                node: store.reg(gs.rem.item.register).reg({ id: n.id })
                                            }
                                        })
                                    ])

                                    res({ cursor: data.cursor } as const)
                                },
                            }
                        }
                    })); break;
                    case EFCon_NodeKind.Material: store.reg(gs.rem.material.act.get({
                        query: {
                            limit: api.limit,
                            cursor: api.cursor ?? null,

                            include_hidden: 1,
                            pick_tmplmt__id: null,
                            pick_owner: ["null-private"],
                            search: expr_new(api.search.filter),
                        },

                        config: {
                            signal_abort: api.signal_abort,

                            events: {
                                failure: reason => {
                                    rej(reason)
                                },

                                success: data => {
                                    api.data.input([
                                        ...api.data.output(),

                                        ...(data.slice.material?.nodes ?? []).map(n => {
                                            return {
                                                kind: EFCon_NodeKind.Material as const,
                                                node: store.reg(gs.rem.material.register).reg({ id: n.id })
                                            }
                                        })
                                    ])

                                    res({ cursor: data.cursor } as const)
                                },
                            }
                        }
                    })); break;
                    case EFCon_NodeKind.ItemTemplate: store.reg(gs.rem.tmplit.act.get({
                        query: {
                            limit: api.limit,
                            cursor: api.cursor ?? null,

                            include_hidden: 1,
                            pick_owner: ["null-private"],

                            search: expr_new(api.search.filter),
                        },

                        config: {
                            signal_abort: api.signal_abort,

                            events: {
                                failure: reason => {
                                    rej(reason)
                                },

                                success: data => {
                                    api.data.input([
                                        ...api.data.output(),

                                        ...(data.slice.tmplit?.nodes ?? []).map(n => {
                                            return {
                                                kind: EFCon_NodeKind.ItemTemplate as const,
                                                node: store.reg(gs.rem.tmplit.register).reg({ id: n.id })
                                            }
                                        })
                                    ])

                                    res({ cursor: data.cursor } as const)
                                },
                            }
                        }
                    })); break;
                    case EFCon_NodeKind.ProductTemplate: store.reg(gs.rem.tmplpr.act.get({
                        query: {
                            limit: api.limit,
                            cursor: api.cursor ?? null,

                            include_hidden: 1,
                            pick_owner: ["null-private"],

                            search: expr_new(api.search.filter),
                        },

                        config: {
                            signal_abort: api.signal_abort,

                            events: {
                                failure: reason => {
                                    rej(reason)
                                },

                                success: data => {
                                    api.data.input([
                                        ...api.data.output(),

                                        ...(data.slice.tmplpr?.nodes ?? []).map(n => {
                                            return {
                                                kind: EFCon_NodeKind.ProductTemplate as const,
                                                node: store.reg(gs.rem.tmplpr.register).reg({ id: n.id })
                                            }
                                        })
                                    ])

                                    res({ cursor: data.cursor } as const)
                                },
                            }
                        }
                    })); break;
                    case EFCon_NodeKind.MaterialTemplate: store.reg(gs.rem.tmplmt.act.get({
                        query: {
                            limit: api.limit,
                            cursor: api.cursor ?? null,

                            include_hidden: 1,
                            pick_owner: ["null-private"],

                            search: expr_new(api.search.filter),
                        },

                        config: {
                            signal_abort: api.signal_abort,

                            events: {
                                failure: reason => {
                                    rej(reason)
                                },

                                success: data => {
                                    api.data.input([
                                        ...api.data.output(),
                                        ...(data.slice.tmplmt?.nodes ?? []).map(n => {
                                            return {
                                                kind: EFCon_NodeKind.MaterialTemplate as const,
                                                node: store.reg(gs.rem.tmplmt.register).reg({ id: n.id })
                                            }
                                        })
                                    ])

                                    res({ cursor: data.cursor } as const)
                                },
                            }
                        }
                    })); break;
                }
            })
        },
    })
}
