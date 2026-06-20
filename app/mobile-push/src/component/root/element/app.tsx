import { EPCtxPalette_View } from "@/src/component/primitive/ctx-palette/element/view"
import ER_Nav from "@/src/component/root/element/nav"
import { er__pushtoken_add } from "@/src/component/root/util/pushtoken_add"
import { Palette_ThemeKind } from "@/src/util/palette/def"
import { remx } from "@fst/gstate"
import * as asc from "@qyu/atom-state-core"
import * as asr from "@qyu/atom-state-react"
import { er__st_app as st } from "@src/component/root/style/core"
import * as r from "react"
import * as rn from "react-native"
import { SafeAreaProvider, useSafeAreaInsets, } from "react-native-safe-area-context"

type EL__Content_Props = {

}

const EL_Content: r.FC<EL__Content_Props> = props => {
    const store = asr.useAtomStore()
    const safeAreaInsets = useSafeAreaInsets()

    asr.useAtomLoader({
        atomloader: remx.auth.loaders.check,
        params: r.useMemo(() => [] as [], []),
    })

    r.useEffect(() => {
        return er__pushtoken_add(store)
    }, [store])

    return <rn.View style={st.container}>
        <rn.View style={{ height: safeAreaInsets.top }} />

        <ER_Nav />

        <rn.View style={{ height: safeAreaInsets.bottom }} />
    </rn.View>
}

const store = asc.atomstore_new()

export const ER_App: r.FC = () => {
    const isDarkMode = rn.useColorScheme() === "dark"
    const [themekind, themekind_set] = r.useState(Palette_ThemeKind.Primary)

    return <asr.AtomStoreContext value={store}>
        <SafeAreaProvider>
            <EPCtxPalette_View value={{ themekind, themekind_set }}>
                <rn.StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

                <EL_Content />
            </EPCtxPalette_View>
        </SafeAreaProvider>
    </asr.AtomStoreContext>
}

export default ER_App
