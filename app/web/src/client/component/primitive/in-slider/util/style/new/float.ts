import type { EPInSlider_FloatConfig } from "@src/client/component/primitive/in-slider/type/float"
import * as r from "react"

export const elinslider__style_new_trackfloat = function(config: EPInSlider_FloatConfig, value: number): r.CSSProperties {
    const range = Math.abs(config.max - config.min)
    const progress = Math.min(range, Math.abs(value - config.min)) / range * 100

    if (!config.vertical) {
        return {
            [config.reverse ? "right" : "left"]: `${progress}%`,

            ...{
                [`--progress`]: `${progress}%`,
                [`--progress-arythm`]: `${progress / 100}`,
            } as any,
        }
    }

    return {
        [config.reverse ? "bottom" : "top"]: `${progress}%`,

        ...{
            [`--progress`]: `${progress}%`,
            [`--progress-arythm`]: `${progress / 100}`,
        } as any,
    }
}
