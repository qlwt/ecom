import * as capi from "@fst/capi"
import * as cst from "@fst/cst"
import { rem, remx } from "@fst/gstate"
import type * as rest from "@fst/rest"
import * as asc from "@qyu/atom-state-core"
import * as sc from "@qyu/signal-core"
import * as frb from "@react-native-firebase/app"
import * as frbms from "@react-native-firebase/messaging"
import { v7 as uuid } from "uuid"

const hasrepeat = function(slice: rest.Database_Slice): boolean {
    if (!slice.ping_device) {
        return false
    }

    return slice.ping_device.nodes.length >= 1
}

export const er__pushtoken_add = function(store: asc.AtomStore): VoidFunction {
    const acc = store.reg(remx.auth.state)
    const frbms_app = frb.getApp()
    const frbms_messaging = frbms_app.messaging()

    const sub = async () => {
        const real_o = acc.real.output()

        if (
            real_o.status === asc.ReqState__Status.Fulfilled
            && real_o.data.status_sessional === 0
            && real_o.data.access >= cst.AccountAccess.Moderator
        ) {
            acc.real.rmsub(sub)

            try {
                const status = await frbms.requestPermission(frbms_messaging)

                if (status === frbms.AuthorizationStatus.AUTHORIZED || status === frbms.AuthorizationStatus.PROVISIONAL) {
                    const token = await frbms.getToken(frbms_messaging)

                    const check = await capi.send_rest_data_get("ping_device", {
                        query: {
                            limit: 1,
                            cursor: null,

                            pick_owner: null,
                            include_hidden: 1,
                            pick_token: [token],
                        },
                    })

                    if (check.success && !hasrepeat(check.body.slice)) {
                        store.dispatch(rem.ping_device.act.post({
                            body: [{
                                core: {
                                    id: uuid(),
                                    token: token,
                                },

                                joins: {},
                            }],
                        }))
                    }
                }
            } catch (e) {
            }
        }
    }

    acc.real.addsub(sub)

    sub()

    return () => {
        acc.real.rmsub(sub)
    }

    sc.osignal_when_pick(
        sc.osignal_new_pipe(
            acc.real,
            real_o => {
                return {
                    pick: (
                        real_o.status === asc.ReqState__Status.Fulfilled
                        && real_o.data.status_sessional === 0
                        && real_o.data.access >= cst.AccountAccess.Moderator
                    ),

                    value: null
                }
            },
        ),
        async () => {
        },
    )
}
