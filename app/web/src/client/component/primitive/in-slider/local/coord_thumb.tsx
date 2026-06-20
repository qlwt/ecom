import type { FnSetterStateles } from "@qyu/reactcmp-dropdown"
import st from "@src/client/component/primitive/in-slider/style/core.module.scss"
import type { EPInSlider_FloatConfig } from "@src/client/component/primitive/in-slider/type/float"
import { elinslider__style_new_coords } from "@src/client/component/primitive/in-slider/util/style/new/coords"
import cl from "classnames"
import * as r from "react"

export type ELInSlider__CoordThumb_Props = {
    readonly drag_set: FnSetterStateles<boolean>

    readonly x_value: number
    readonly x_floatconfig: EPInSlider_FloatConfig

    readonly y_value: number
    readonly y_floatconfig: EPInSlider_FloatConfig
}

export const ELInSlider_CoordThumb: r.FC<ELInSlider__CoordThumb_Props> = props => {
    return <div
        className={cl(st.view_sq__coords__square, st._thumb)}

        style={{
            ...elinslider__style_new_coords({
                x_config: props.x_floatconfig,
                y_config: props.y_floatconfig,
                x_value: props.x_value,
                y_value: props.y_value,
            })
        }}
    >
        <div className={st.view_sq__coords__lines} />

        <div
            className={cl(st.view_sq__coords__point, st._thumb)}

            onMouseDown={() => {
                props.drag_set(true)
            }}
        />
    </div>
}

export default ELInSlider_CoordThumb
