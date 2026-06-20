import type { EPInSlider_FloatConfig } from "@src/client/component/primitive/in-slider/type/float"
import * as r from "react"

export type ELInSlider_StyleNewCoords_Params = {
    readonly x_value: number
    readonly x_config: EPInSlider_FloatConfig
    readonly y_value: number
    readonly y_config: EPInSlider_FloatConfig
}

export const elinslider__style_new_coords = function(params: ELInSlider_StyleNewCoords_Params): r.CSSProperties {
    const x_range = Math.abs(params.x_config.max - params.x_config.min)
    const x_progress = Math.min(x_range, Math.abs(params.x_value - params.x_config.min)) / x_range * 100
    const y_range = Math.abs(params.y_config.max - params.y_config.min)
    const y_progress = Math.min(y_range, Math.abs(params.y_value - params.y_config.min)) / y_range * 100

    return {
        ...{
            [`--x-progress`]: `${x_progress}%`,
            [`--x-progress-arythm`]: `${x_progress / 100}`,
            [`--y-progress`]: `${y_progress}%`,
            [`--y-progress-arythm`]: `${y_progress / 100}`,
        } as any,
    }
}
