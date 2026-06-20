import * as gs from "@fst/gstate"
import * as asc from "@qyu/atom-state-core"

const withtrimmed = function <T>(source: string, getter: (source: string) => T): T | null {
    const source_trimmed = source.trim()

    if (source_trimmed.length === 0) {
        return null
    }

    return getter(source_trimmed)
}

export type EFConCommisions__PaginatorNew_Search = {
    readonly field_id_public: string
    readonly field_email: string
    readonly field_phone: string
    readonly field_name_first: string
    readonly field_name_family: string
    readonly field_name_father: string
    readonly field_city: string
    readonly field_region: string
    readonly field_division: string
    readonly field_status_paid: 0 | 1
    readonly field_status_delivered: 0 | 1
}

export type EFConCommisions__PaginatorNew_DataNode = (
    gs.Rem_Node<"commision">
)

export type EFConCommisions__PaginatorNew_Limit = number

export type EFConCommisions__PaginatorNew_Paginator = gs.PaginatorList<
    EFConCommisions__PaginatorNew_DataNode,
    EFConCommisions__PaginatorNew_Search,
    EFConCommisions__PaginatorNew_Limit
>

export type EFConCommisions__PaginatorNew_Params = {
    readonly store: asc.AtomStore
    readonly search: EFConCommisions__PaginatorNew_Search
}

export const efconcommisions__paginator_new = function(params: EFConCommisions__PaginatorNew_Params) {
    return gs.paginator_new_list<
        EFConCommisions__PaginatorNew_DataNode,
        EFConCommisions__PaginatorNew_Search,
        null | string,
        EFConCommisions__PaginatorNew_Limit
    >({
        init: {
            data: [],
            cursor: null as null | string,
        },

        config: {
            retrydelay: 5000,
            search: params.search,
        },

        request_new: api => {
            return new Promise((res, rej) => {
                params.store.reg(gs.rem.commision.act.get({
                    query: {
                        id_public: null,
                        limit: api.limit,
                        pick_owner: null,
                        include_hidden: 1,
                        cursor: api.cursor ?? null,

                        search: {
                            op: "&",

                            children: [
                                withtrimmed(api.search.field_id_public, id_public => ({
                                    op: "=",
                                    label: "id_public",
                                    value: id_public,
                                } as const)),

                                withtrimmed(api.search.field_email, email => ({
                                    op: "=",
                                    label: "email",
                                    value: email,
                                } as const)),

                                withtrimmed(api.search.field_phone, phone => ({
                                    op: "=",
                                    label: "phone",
                                    value: phone,
                                } as const)),

                                withtrimmed(api.search.field_name_first, name_first => ({
                                    op: "=",
                                    label: "name_first",
                                    value: name_first,
                                } as const)),

                                withtrimmed(api.search.field_name_family, name_family => ({
                                    op: "=",
                                    label: "name_family",
                                    value: name_family,
                                } as const)),

                                withtrimmed(api.search.field_name_father, name_father => ({
                                    op: "=",
                                    label: "name_father",
                                    value: name_father,
                                } as const)),

                                withtrimmed(api.search.field_city, city => ({
                                    op: "=",
                                    label: "city",
                                    value: city,
                                } as const)),

                                withtrimmed(api.search.field_region, region => ({
                                    op: "=",
                                    label: "region",
                                    value: region,
                                } as const)),

                                withtrimmed(api.search.field_division, division => ({
                                    op: "=",
                                    label: "division",
                                    value: division,
                                } as const)),

                                {
                                    op: "=",
                                    label: "paid",
                                    value: api.search.field_status_paid.toString()
                                } as const,

                                {
                                    op: "=",
                                    label: "delivered",
                                    value: api.search.field_status_delivered.toString()
                                } as const,
                            ].filter(n => n !== null)
                        },
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

                                    ...(data.slice.commision?.nodes ?? []).map(n => {
                                        return params.store.reg(gs.rem.commision.register).reg({ id: n.id })
                                    })
                                ])

                                res({ cursor: data.cursor } as const)
                            },
                        }
                    }
                }))
            })
        },
    })
}
