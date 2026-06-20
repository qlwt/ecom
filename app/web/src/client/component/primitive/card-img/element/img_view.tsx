import st from "@client/component/primitive/card-img/style/core.module.scss"
import * as fas_image from "@fortawesome/free-solid-svg-icons/faImage"
import * as faw from "@fortawesome/react-fontawesome"
import cl from "classnames"
import * as r from "react"

export type EPCardImg__ImgView_Props = {
    readonly state_error?: boolean

    readonly src?: string | null
    readonly sizes?: string | null
    readonly srcset?: string | null
}

export const EPCardImg_ImgView: r.FC<EPCardImg__ImgView_Props> = props => {
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

    return <div className={cl(
        st.imgc,
        st.imgc_view,
        props.state_error && st._error,
    )}>
        {child}
    </div>
}

export default EPCardImg_ImgView
