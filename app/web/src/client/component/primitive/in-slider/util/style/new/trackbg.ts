import type { EPInSlider_FloatConfig } from "@src/client/component/primitive/in-slider/type/float"
import { elinslider__progress_new_arythm } from "@src/client/component/primitive/in-slider/util/progress/new/arythm"
import * as r from "react"

export const elinslider__style_new_trackbg = function(config: EPInSlider_FloatConfig, value: number): r.CSSProperties {
    const progress = elinslider__progress_new_arythm(config, value)

    if (!config.vertical) {
        return {
            backgroundSize: `${Math.abs(Number(!config.reverse) - progress) * 100}% 100%`
        }
    }

    return {
        backgroundSize: `100% ${Math.abs(Number(!config.reverse) - progress) * 100}%`
    }
}
