import { efheader__st_core as stf } from "@/src/component/feature/header/style/core"
import { usePalette } from "@/src/component/primitive/ctx-palette/hook/palette"
import { useAuthAcc } from "@/src/hook/auth/acc"
import * as fas_refresh from "@fortawesome/free-solid-svg-icons/faArrowRotateRight"
import * as fas_signin from "@fortawesome/free-solid-svg-icons/faSignInAlt"
import * as fas_user from "@fortawesome/free-solid-svg-icons/faUser"
import * as fan from "@fortawesome/react-native-fontawesome"
import * as rnav from "@react-navigation/native"
import * as r from "react"
import * as rn from "react-native"

const Animated_Pressable = rn.Animated.createAnimatedComponent(rn.Pressable)

export type EFHeader__View_Props = {
    readonly event_refresh?: VoidFunction
}

export const EFHeader_View: r.FC<EFHeader__View_Props> = props => {
    const ref_animtarget = r.useRef<number>(0)

    const theme = usePalette()
    const st = stf({ theme })
    const navigation = rnav.useNavigation()
    const anim_refresh = rn.useAnimatedValue(0)

    const animi_refresh_deg = r.useMemo(() => anim_refresh.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
        extrapolate: "extend",
    }), [anim_refresh])

    const acc = useAuthAcc()

    const status_signed = acc?.status_sessional === 0

    return <rn.View style={st.root}>
        <Animated_Pressable
            style={[st.btn, { transform: [{ rotate: animi_refresh_deg }] }]}

            onPress={() => {
                props.event_refresh?.()

                rn.Animated.timing(anim_refresh, {
                    toValue: ++ref_animtarget.current,
                    useNativeDriver: true,
                }).start()
            }}
        >
            <fan.FontAwesomeIcon
                icon={fas_refresh.faArrowRotateRight}
                style={st.btn__txt}
                color={st.btn__txt.color}
                size={st.btn__txt.fontSize}
            />
        </Animated_Pressable>

        <rn.Pressable
            style={st.btn}

            onPress={() => {
                if (!status_signed) {
                    navigation.navigate("sign_in", {})
                }
            }}
        >
            <fan.FontAwesomeIcon
                style={st.btn__txt}
                color={st.btn__txt.color}
                size={st.btn__txt.fontSize}
                icon={status_signed ? fas_user.faUser : fas_signin.faSignInAlt}
            />
        </rn.Pressable>
    </rn.View>
}
