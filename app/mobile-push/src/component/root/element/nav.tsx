import { EFHome_Page } from "@/src/component/feature/home/element/page"
import { EFSign_PageIn } from "@/src/component/feature/sign/element/page_in"
import * as rnav from "@react-navigation/native"
import * as rnav_stack from "@react-navigation/native-stack"

const NavStack = rnav_stack.createNativeStackNavigator({
    initialRouteName: "home",

    screens: {
        home: {
            screen: EFHome_Page,
            options: { headerShown: false }
        },

        sign_in: {
            screen: EFSign_PageIn,
            options: { headerShown: false }
        }
    },
})

export type NavData = rnav.StaticParamList<typeof NavStack>

declare global {
    namespace ReactNavigation {
        interface RootParamList extends NavData {
        }
    }
}

export const ER_Nav = rnav.createStaticNavigation(NavStack)

export default ER_Nav
