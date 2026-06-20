import * as cs from "@fst/config/server"
import { env_db_host, env_db_name, env_db_password, env_db_port, env_db_user } from "@src/env"
import * as ksly from "kysely"
import * as pg from "pg"

export const db = new ksly.Kysely<cs.Database>({
    dialect: new ksly.PostgresDialect({
        pool: new pg.Pool({
            password: env_db_password,
            database: env_db_name,
            host: env_db_host,
            user: env_db_user,
            port: env_db_port,
        }),
    }),
})

pg.types.setTypeParser(20, val => Number.parseInt(val))

const dbtype_new_ftype = function(ftype: cs.FType): string {
    let acc: string

    switch (ftype.def.kind) {
        case "never":
        case "array":
        case "tuple":
        case "file":
        case "search":
        case "union":
            throw new Error(`${ftype.def.kind} type can not be expressed as database type`)
        case "record_text":
            acc = "jsonb"

            break
        case "uuid":
            acc = "uuid"

            break
        case "int64":
            acc = "bigint"

            break
        case "int32":
            acc = "int"

            break
        case "bool":
        case "int16":
        case "enum-int":
            acc = "smallint"

            break
        case "enum-string":
        case "charset":
        case "text":
        case "formula":
            acc = "text"

            break
        case "float":
            acc = "float"

            break
        case "double":
            acc = "double precision"

            break
    }

    if (!ftype.status_optional) {
        acc += ` not null`
    }

    return acc
}

const dbtype_new_field = function(field: cs.Field): string {
    let acc = dbtype_new_ftype(field.ftype)

    if (field.status_primary) {
        acc += " PRIMARY KEY"
    }

    if (field.status_unique) {
        acc += " UNIQUE"
    }

    return acc
}

export const db_define = async function() {
    return await db.transaction().execute(async trx => {
        for (const [table_name, table] of [...Object.entries(cs.def.table_local), ...Object.entries(cs.def.table_public)]) {
            let creation = ``
            let indexes = ``

            creation += `CREATE TABLE IF NOT EXISTS ${table_name} (`

            let insertcomma = false
            for (const [field_name, field] of Object.entries(table.fields)) {
                if (insertcomma) {
                    creation += `,\n\t`
                } else {
                    creation += `\n\t`

                    insertcomma = true
                }

                creation += `${field_name} ${dbtype_new_field(field)}`

                if (field.status_indexed) {
                    indexes += `CREATE INDEX IF NOT EXISTS idx__${table_name}__${field_name} on ${table_name}(${field_name});\n`
                }
            }

            creation += `\n);\n`

            await ksly.sql.raw(creation).execute(trx)

            if (indexes.length >= 1) {
                await ksly.sql.raw(indexes).execute(trx)
            }
        }

        for (const [table_name, table] of [...Object.entries(cs.def.table_local), ...Object.entries(cs.def.table_public)]) {
            for (const [field_name, field] of Object.entries(table.fields)) {
                if (field.relation) {
                    let acc = ``

                    acc += "DO $$"
                    acc += `\nBEGIN`
                    acc += `\nIF NOT EXISTS (`
                    acc += `\n\tSELECT 1 FROM pg_constraint WHERE conname = 'fk__${table_name}__${field_name}__${field.relation.table}__${field.relation.field}'`
                    acc += `\n) THEN`
                    acc += `\n\tALTER TABLE ${table_name}`
                    acc += `\n\tADD CONSTRAINT fk__${table_name}__${field_name}__${field.relation.table}__${field.relation.field}`

                    if (field.ftype.status_optional) {
                        acc += `\n\tFOREIGN KEY (${field_name}) REFERENCES ${field.relation.table}(${field.relation.field}) ON DELETE SET NULL;`
                    } else {
                        acc += `\n\tFOREIGN KEY (${field_name}) REFERENCES ${field.relation.table}(${field.relation.field}) ON DELETE CASCADE;`
                    }

                    acc += `\nEND IF;`
                    acc += `\nEND $$;`

                    await ksly.sql.raw(acc).execute(trx)
                }
            }
        }
    })
}
