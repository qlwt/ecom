import * as asc from "@qyu/atom-state-core"
import * as sc from "@qyu/signal-core"

type Dep = {
    esignal: sc.ESignal
    sub: VoidFunction
}

export type Indexer_ConnectFamilyDynamic_Params<V extends sc.OSignal> = Readonly<{
    indexer: asc.Indexer<V, sc.Signal_InferO<V>, any>
    source: asc.AtomFamily<any, V>
}>

export const indexer_connect_family_dynamic = function <V extends sc.OSignal>(
    params: Indexer_ConnectFamilyDynamic_Params<V>
): asc.AtomSelectorStatic<VoidFunction> {
    return ({ reg }) => {
        const family = reg(params.source)
        const map_deps = new Map<V, Dep>()

        const ev_post = function(value: V) {
            {
                const data = value.output()

                params.indexer.ref_add(value, data)
            }

            {
                const esignal = value

                const sub = () => {
                    params.indexer.ref_update(value, value.output())
                }

                map_deps.set(value, {
                    esignal,
                    sub
                })

                esignal.addsub(sub, { order: 1 })
            }
        }

        const ev_delete = function(value: V) {
            params.indexer.ref_delete(value)

            const dep = map_deps.get(value)!

            dep.esignal.rmsub(dep.sub)

            map_deps.delete(value)
        }

        const listener = function(ev: asc.AtomFamily_EntryChangeEvent<V>) {
            switch (ev.type) {
                case "post": {
                    ev_post(ev.value_next)

                    break
                }
                case "delete": {
                    ev_delete(ev.value_prev)

                    break
                }
                case "patch": {
                    sc.batcher.batch_sync(() => {
                        ev_delete(ev.value_prev)
                        ev_post(ev.value_next)
                    })

                    break
                }
            }
        }

        sc.batcher.batch_sync(() => {
            family.entries_signal().output().forEach(([, ref]) => {
                ev_post(ref)
            })
        })

        family.entries_event_change_addsub(listener)

        return () => {
            family.entries_event_change_rmsub(listener)

            map_deps.forEach(dep => {
                dep.esignal.rmsub(dep.sub)
            })
        }
    }
}
