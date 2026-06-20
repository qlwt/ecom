import { efhome__stf_core } from "@/src/component/feature/home/style/core"
import { usePalette } from "@/src/component/primitive/ctx-palette/hook/palette"
import { time_format_ago } from "@/src/util/time/format/ago"
import * as fab_telegram from "@fortawesome/free-brands-svg-icons/faTelegram"
import * as fab_viber from "@fortawesome/free-brands-svg-icons/faViber"
import * as fas_bell from "@fortawesome/free-solid-svg-icons/faBell"
import * as fas_phone from "@fortawesome/free-solid-svg-icons/faPhone"
import * as fan from "@fortawesome/react-native-fontawesome"
import * as cst from "@fst/cst"
import * as gs from "@fst/gstate"
import { rem } from "@fst/gstate"
import * as asr from "@qyu/atom-state-react"
import * as rfl from "@qyu/reactcmp-flow-control"
import * as r from "react"
import * as rn from "react-native"

const time_init = Date.now()

const icon_new = function(cmethod: cst.PingMe_ContactMethod) {
    switch (cmethod) {
        case cst.PingMe_ContactMethod.Phone:
            return fas_phone.faPhone
        case cst.PingMe_ContactMethod.Viber:
            return fab_viber.faViber
        case cst.PingMe_ContactMethod.Telegram:
            return fab_telegram.faTelegram
    }
}

export type ELHome__Notification_Props = {
    readonly node: gs.Rem_JoinData<"ping_msg">
}

export const ELHome_Notification: r.FC<ELHome__Notification_Props> = props => {
    const theme = usePalette()
    const st = efhome__stf_core({ theme })
    const dispatch = asr.useAtomDispatch()

    return <rn.View style={st.item}>
        <rn.View style={st.item__head}>
            <rn.View style={st.item__icon__view}>
                <fan.FontAwesomeIcon
                    icon={icon_new(props.node.cmethod)}
                    style={st.item__icon__txt}
                    color={st.item__icon__txt.color}
                    size={st.item__icon__txt.fontSize}
                />
            </rn.View>

            <rn.Text>
                {
                    `(${props.node.phone.slice(0, 3)})`
                    + ` ${props.node.phone.slice(3, 6)}`
                    + ` ${props.node.phone.slice(6, 8)}`
                    + ` ${props.node.phone.slice(8, 10)}`
                }
            </rn.Text>

            <rn.Text style={st.item__date}>
                {time_format_ago(time_init - props.node.creation_date)}
            </rn.Text>
        </rn.View>

        <rn.View style={st.item__acts}>
            <rn.Pressable
                style={[st.item__act__view, st.item__act__view_bell]}

                onPress={() => {
                    if (!props.node.status_checked) {
                        dispatch(rem.ping_msg.act.patch({
                            body: {
                                id: props.node.id,

                                patch: {
                                    status_checked: 1,
                                },
                            },
                        }))
                    }
                }}
            >
                <fan.FontAwesomeIcon
                    icon={fas_bell.faBell}
                    style={st.item__act__txt}
                    color={st.item__act__txt.color}
                    size={st.item__act__txt.fontSize}
                />

                <rfl.CmpIf value={!props.node.status_checked}>
                    {() => {
                        return <rn.View style={st.item__act__reddot} />
                    }}
                </rfl.CmpIf>
            </rn.Pressable>
        </rn.View>

        <rfl.CmpIf value={props.node.status_checked === 1}>
            {() => <rn.View style={st.item__fog} />}
        </rfl.CmpIf>
    </rn.View>
}

export default ELHome_Notification
