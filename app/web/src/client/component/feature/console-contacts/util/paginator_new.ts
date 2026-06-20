import * as gs from "@fst/gstate"
import * as asc from "@qyu/atom-state-core"

const withtrimmed = function <T>(source: string, getter: (source: string) => T): T | null {
    const source_trimmed = source.trim()

    if (source_trimmed.length === 0) {
        return null
    }

    return getter(source_trimmed)
}

export type EFConContacts__PaginatorNew_Search = {
    readonly field_email: string
    readonly field_topic: string
    readonly field_content: string
    readonly field_status_reviewed: 0 | 1
}

export type EFConContacts__PaginatorNew_DataNode = (
    gs.Rem_Node<"contact_message">
)

export type EFConContacts__PaginatorNew_Limit = number

export type EFConContacts__PaginatorNew_Paginator = gs.PaginatorList<
    EFConContacts__PaginatorNew_DataNode,
    EFConContacts__PaginatorNew_Search,
    EFConContacts__PaginatorNew_Limit
>

export type EFConContacts__PaginatorNew_Params = {
    readonly store: asc.AtomStore
    readonly search: EFConContacts__PaginatorNew_Search
}

export const efconcontacts__paginator_new = function(params: EFConContacts__PaginatorNew_Params) {
    return gs.paginator_new_list<
        EFConContacts__PaginatorNew_DataNode,
        EFConContacts__PaginatorNew_Search,
        null | string,
        EFConContacts__PaginatorNew_Limit
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
                params.store.reg(gs.rem.contact_message.act.get({
                    query: {
                        limit: api.limit,
                        cursor: api.cursor ?? null,
                        pick_owner: null,
                        include_hidden: 1,

                        search: {
                            op: "&",

                            children: [
                                withtrimmed(api.search.field_email, email => ({
                                    op: "=",
                                    label: "email",
                                    value: email,
                                } as const)),

                                withtrimmed(api.search.field_topic, topic => ({
                                    op: "=",
                                    label: "topic",
                                    value: topic,
                                } as const)),

                                withtrimmed(api.search.field_content, content => ({
                                    op: "=",
                                    label: "content",
                                    value: content,
                                } as const)),

                                {
                                    op: "=",
                                    label: "reviewed",
                                    value: api.search.field_status_reviewed.toString()
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

                                    ...(data.slice.contact_message?.nodes ?? []).map(n => {
                                        return params.store.reg(gs.rem.contact_message.register).reg({ id: n.id })
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
