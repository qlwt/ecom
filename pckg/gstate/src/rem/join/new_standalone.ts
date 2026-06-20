import * as cc from "@fst/config/client"
import * as asc from "@qyu/atom-state-core"
import type { Rem_Index, Rem_JoinStandaloneFactory, Rem_NodeDefStandalone, Rem_NodeStandalone, Rem_Result } from "@src/rem/type/result"
import { atomremnode_join_prop_optional } from "@src/util/asc/atomremnode/join/prop_optional"
import { atomremnode_join_sort } from "@src/util/asc/atomremnode/join/sort"
import { atomremnode_join_step } from "@src/util/asc/atomremnode/join/step"
import { object_new_map } from "@src/util/object/map"

export type NRem_JoinNewStandalone_Params<TName extends keyof cc.RemDef, Variant extends keyof cc.RemDef[TName]["joins"]> = {
    readonly table_name: TName
    readonly self_variant: Variant
    readonly rem_new: () => Rem_Result
    readonly node_new: () => asc.AtomSelectorStatic<Rem_NodeStandalone<TName>>
}

export const nrem_join_new_standalone = function <TName extends keyof cc.RemDef, Variant extends keyof cc.RemDef[TName]["joins"]>(
    params: NRem_JoinNewStandalone_Params<TName, Variant>
): Rem_JoinStandaloneFactory<TName, Variant> {
    return () => ({ reg }) => {
        const rem = params.rem_new()

        return reg(asc.atomremnode_join_root<{}, Rem_NodeDefStandalone<"item">, {}>({
            link: () => () => reg(params.node_new()) as any as Rem_NodeStandalone<"item">,

            properties: object_new_map(
                cc.remdef[params.table_name as "item"].joins[params.self_variant as "core"],
                (join: cc.Join) => {
                    switch (join.kind) {
                        case "forwards":
                            if (join.status_optional) {
                                return atomremnode_join_step(
                                    atomremnode_join_prop_optional({
                                        source: rem[join.target_table as "tmplit"].joins[join.variant as "core"](),

                                        transformer: (param: asc.AtomRemNode__Data<Rem_NodeDefStandalone<"item">>) => {
                                            if (typeof param.data?.[join.self_field as "tmplit__id"] !== "string") {
                                                return undefined
                                            }

                                            return {
                                                id: param.data[join.self_field as "tmplit__id"],
                                            }
                                        },
                                    } as const)
                                )
                            }

                            return atomremnode_join_step(
                                asc.atomremnode_join_required(asc.atomremnode_join_prop({
                                    source: rem[join.target_table as "tmplit"].joins[join.variant as "core"](),

                                    transformer: (param: asc.AtomRemNode__Data<Rem_NodeDefStandalone<"item">>) => {
                                        return {
                                            id: param.data![join.self_field as "tmplit__id"],
                                        } satisfies Rem_Index
                                    },
                                }))
                            )
                        case "backwards":
                            const idx = rem[join.target_table as "variant"].indexer_new(["deleted", join.target_field as "item__id"])

                            return atomremnode_join_sort(
                                asc.atomremnode_join_array_flat({
                                    transformer: (param: asc.AtomRemNode__Data<Rem_NodeDefStandalone<"item">>) => reg(idx).reg({
                                        deleted: 0,
                                        [join.target_field as "item__id"]: param.data![join.self_field as "id"],
                                    }),

                                    source: atomremnode_join_step(
                                        asc.atomremnode_join_required(asc.atomremnode_join_pipe({
                                            source: rem[join.target_table as "variant"].joins[join.variant as "core"](),
                                            transformer: param => ({ id: param.statics.id, }),
                                        }))
                                    )
                                }),
                                (a, b) => {
                                    return a.creation_date - b.creation_date
                                }
                            )
                    }
                }
            ),
        })) as any
    }
}
