import * as asc from "@qyu/atom-state-core";
import type { Rem_Indexer, Rem_IndexerBuilder } from "@src/rem/type/result";

export type NRemIndexer_New_Params<Def extends asc.AtomRemNode_Def> = {
    readonly register: asc.AtomFamily<any, asc.AtomRemNode_Value<Def>>
}

export const nrem_indexer_new = function <Def extends asc.AtomRemNode_Def>(
    params: NRemIndexer_New_Params<Def>
): Rem_IndexerBuilder<Def> {
    const fieldmap = new Map<string | number | symbol, bigint>()
    const familymap = new Map<bigint, Rem_Indexer<Def, (keyof Def["data"])[]>>()

    return <Fields extends readonly (keyof Def["data"])[]>(fields: Fields) => {
        let index = 0n

        for (const field of fields) {
            let field_id = fieldmap.get(field)

            if (field_id === undefined) {
                field_id = BigInt(fieldmap.size)

                fieldmap.set(field, field_id)
            }

            index |= 1n << field_id
        }

        return ({ reg }) => {
            let family = familymap.get(index)

            if (!family) {
                family = reg(asc.atomfamily_new_indexer({
                    key: param => {
                        return JSON.stringify(fields.map(field => param[field]))
                    },

                    param: (param: Pick<Def["data"], Fields[number]>) => {
                        return {
                            data: param,
                        }
                    },

                    indexer: () => {
                        const indexer_fields: { [K in keyof any]: asc.Indexer<any, any, any> } = {}

                        // only index tracked fields
                        for (const field of fields) {
                            indexer_fields[field] = asc.indexer_new_value({})
                        }

                        return asc.indexer_new_object({
                            fields: {
                                data: asc.indexer_new_object({
                                    fields: indexer_fields,
                                })
                            },
                        }) as asc.Indexer<
                            asc.AtomRemNode_Value<Def>,
                            {
                                readonly data: Readonly<Pick<Def["data"], Fields[number]>> | null
                            }, {
                                data: Pick<Def["data"], Fields[number]>
                            }
                        >
                    },

                    connect: indexer => {
                        return asc.indexer_connect_remnode<Def>({
                            source: params.register,
                            indexer,
                        })
                    },
                }))

                familymap.set(index, family)
            }

            return family
        }
    }
}
