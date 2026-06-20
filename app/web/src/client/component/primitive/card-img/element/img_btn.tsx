import st from "@client/component/primitive/card-img/style/core.module.scss"
import * as fas_image from "@fortawesome/free-solid-svg-icons/faImage"
import * as faw from "@fortawesome/react-fontawesome"
import cl from "classnames"
import * as r from "react"

export type EPCardImg__ImgBtn_Props = {
    readonly src?: string | null
    readonly sizes?: string | null
    readonly srcset?: string | null

    readonly state_error?: boolean
    readonly state_disabled?: boolean

    readonly event_click?: VoidFunction
    readonly event_click_image?: VoidFunction
    readonly event_click_placeholder?: VoidFunction
}

export const EPCardImg_ImgBtn: r.FC<EPCardImg__ImgBtn_Props> = props => {
    const child = r.useMemo(() => {
        if (typeof props.src === "string") {
            return <div className={st.imgc__imgv}>
                <img
                    className={st.imgc__img}
                    src={props.src}
                    sizes={props.sizes ?? undefined}
                    srcSet={props.srcset ?? undefined}
                />
            </div>
        }

        return <div className={st.imgc__placeholder}>
            <faw.FontAwesomeIcon icon={fas_image.faImage} />
        </div>
    }, [props.src, props.srcset, props.sizes])

    return <button
        disabled={props.state_disabled}

        className={cl(
            st.imgc,
            st.imgc_btn,
            props.state_error && st._error,
            props.state_disabled && st._disabled,
        )}

        onClick={() => {
            if (typeof props.src === "string") {
                props.event_click_image?.()
            } else {
                props.event_click_placeholder?.()
            }

            props.event_click?.()
        }}
    >
        {child}
    </button>
}

export default EPCardImg_ImgBtn
