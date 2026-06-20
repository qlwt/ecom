import type { EPInSlider_FloatConfig } from "@src/client/component/primitive/in-slider/type/float"

export const elinslider__progress_new_arythm = function(config: EPInSlider_FloatConfig, value: number): number {
    const range = Math.abs(config.max - config.min)
    const progress_raw = (value - config.min) / range

    if (config.reverse) {
        return 1 - progress_raw
    }

    return progress_raw
}
