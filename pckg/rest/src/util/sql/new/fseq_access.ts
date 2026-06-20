import * as eu from "@fst/express-utils"
import { sql_new_fseq_and } from "@src/util/sql/new/fseq_and"
import { sql_new_fseq_or } from "@src/util/sql/new/fseq_or"
import { sql_new_val_list } from "@src/util/sql/new/val_list"
import * as ksly from "kysely"
import * as z from "zod"

export type Sql_NewFSeqAccess_Query = z.ZodType<{
    readonly access_public: 0 | 1
    readonly access_hidden: 0 | 1 | null
    readonly access_owners: (readonly string[]) | null
}>

export type Sql_NewFSeqAccess_PrepParams<Query extends Sql_NewFSeqAccess_Query> = {
    readonly table_name: string
    readonly ctx: eu.Route__NewPath_Context
    readonly query: NoInfer<z.infer<Query>>
    readonly raw: ksly.RawBuilder<unknown> | null
}

export type Sql_NewFSeqAccess_Params<Query extends Sql_NewFSeqAccess_Query> = {
    readonly table_name: string
    readonly ctx: eu.Route__NewPath_Context
    readonly query: NoInfer<z.infer<Query>>

    readonly prep_owner?: (params: Sql_NewFSeqAccess_PrepParams<Query>) => Promise<readonly (null | ksly.RawBuilder<unknown>)[]>
    readonly prep_public?: (params: Sql_NewFSeqAccess_PrepParams<Query>) => Promise<readonly (null | ksly.RawBuilder<unknown>)[]>
}

export const sql_new_fseq_access = async function <Query extends Sql_NewFSeqAccess_Query>(
    params: Sql_NewFSeqAccess_Params<Query>
): Promise<ksly.RawBuilder<unknown>> {
    const nprop_prep_owner = params.prep_owner ?? (l_p => [l_p.raw])
    const nprop_prep_public = params.prep_owner ?? (l_p => [l_p.raw])

    const sqlq_owners = sql_new_val_list(
        params.query.access_owners?.map(id => ksly.sql`${id}`) ?? null
    )

    return sql_new_fseq_and([
        ...await nprop_prep_owner({
            ctx: params.ctx,
            query: params.query,
            table_name: params.table_name,

            raw: sql_new_fseq_or([
                (sqlq_owners
                    ? ksly.sql`
                        ${ksly.sql.raw(params.table_name)}.access_owner in ${sqlq_owners}
                    `
                    : null
                ),

                (params.query.access_owners === null
                    ? ksly.sql`${ksly.sql.raw(params.table_name)}.access_owner is not null`
                    : null
                ),

                (params.query.access_public
                    ? ksly.sql`${ksly.sql.raw(params.table_name)}.access_owner is null`
                    : null
                ),
            ])
        }),

        ...await nprop_prep_public({
            ctx: params.ctx,
            query: params.query,
            table_name: params.table_name,

            raw: (params.query.access_hidden !== null
                ? ksly.sql`${ksly.sql.raw(params.table_name)}.access_hidden = ${params.query.access_hidden}`
                : null
            ),
        })
    ])!
}
