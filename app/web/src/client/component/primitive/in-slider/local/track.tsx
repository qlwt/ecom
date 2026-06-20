import type { FnSetterStateles } from "@qyu/reactcmp-dropdown"
import st from "@src/client/component/primitive/in-slider/style/core.module.scss"
import type { EPInSlider_DragParams } from "@src/client/component/primitive/in-slider/type/drag"
import type { EPInSlider_FloatConfig } from "@src/client/component/primitive/in-slider/type/float"
import { elinslider__style_new_trackbg } from "@src/client/component/primitive/in-slider/util/style/new/trackbg"
import cl from "classnames"
import * as r from "react"

export type ELInSlider__Track_Props = {
    readonly value: number
    readonly ref_track?: r.Ref<HTMLDivElement>
    readonly floatconfig: EPInSlider_FloatConfig

    readonly drag_set: FnSetterStateles<boolean>
    readonly drag_update: (params: EPInSlider_DragParams) => void
}

export const ELInSlider_Track: r.FC<ELInSlider__Track_Props> = props => {
    return <div
        className={st.line__track__view}

        onMouseDown={ev => {
            props.drag_update(ev.nativeEvent)
            props.drag_set(true)
        }}
    >
        <div
            ref={props.ref_track}
            className={cl(st.line__track)}
            style={elinslider__style_new_trackbg(props.floatconfig, props.value)}
        />
    </div>
}

export default ELInSlider_Track
