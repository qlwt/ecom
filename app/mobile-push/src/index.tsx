import { AppRegistry } from "react-native";
import appconf from "@/app.json";
import { ER_App } from "@src/component/root/element/app"

import "@src/polyfill/signal_abort/any"
import "@src/polyfill/structuredClone"
import "react-native-get-random-values"

AppRegistry.registerComponent(appconf.name, () => ER_App);
