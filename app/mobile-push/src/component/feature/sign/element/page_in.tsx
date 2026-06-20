import { efsign__stf_core } from "@/src/component/feature/sign/style/core"
import { usePalette } from "@/src/component/primitive/ctx-palette/hook/palette"
import { gv, remx } from "@fst/gstate"
import * as asr from "@qyu/atom-state-react"
import * as rnav from "@react-navigation/native"
import * as r from "react"
import * as rn from "react-native"
import * as z from "zod"

type EFSign__PageIn_Params = rnav.StaticScreenProps<{}>

export const EFSign_PageIn: r.FC<EFSign__PageIn_Params> = () => {
    const theme = usePalette()
    const dispatch = asr.useAtomDispatch()
    const st = efsign__stf_core({ theme })
    const navigation = rnav.useNavigation()

    const [email, email_set] = r.useState("")
    const [password, password_set] = r.useState("")

    const status_match_email = z.email().safeParse(email).success
    const status_match_password = z.string().min(8).safeParse(password).success
    const status_match = status_match_email && status_match_password

    return <rn.View style={st.root}>
        <rn.View style={st.form}>
            <rn.Text style={st.head}>
                Sign In
            </rn.Text>

            <rn.View style={st.field}>
                <rn.Text style={st.label}>
                    Email
                </rn.Text>

                <rn.TextInput
                    style={st.input}
                    defaultValue={email}
                    placeholder={`your.email@gmail.com`}

                    onChangeText={i_email => {
                        email_set(i_email)
                    }}
                />
            </rn.View>

            <rn.View style={st.field}>
                <rn.Text style={st.label}>
                    Password
                </rn.Text>

                <rn.TextInput
                    style={st.input}
                    defaultValue={password}
                    placeholder={`*************`}

                    onChangeText={i_password => {
                        password_set(i_password)
                    }}
                />
            </rn.View>

            <rn.View style={st.acts}>
                <rn.Pressable
                    style={[st.act, st.act_active]}

                    onPress={() => {
                        navigation.goBack()
                    }}
                >
                    <rn.Text style={st.act__txt}>
                        Go Back
                    </rn.Text>
                </rn.Pressable>

                <rn.Pressable
                    style={[st.act, status_match ? st.act_active : st.act_disabled]}

                    onPress={() => {
                        if (status_match) {
                            dispatch(remx.auth.act.signin_email({
                                body: {
                                    email,
                                    password,
                                },

                                config: {
                                    events: {
                                        success: () => {
                                            navigation.goBack()
                                        },

                                        failure: () => {
                                            gv.report.act.push_error({
                                                text: "Failed to SignIn. Something went wrong"
                                            })
                                        },
                                    }
                                }
                            }))
                        }
                    }}
                >
                    <rn.Text style={st.act__txt}>
                        Sign In
                    </rn.Text>
                </rn.Pressable>
            </rn.View>
        </rn.View>
    </rn.View>
}
