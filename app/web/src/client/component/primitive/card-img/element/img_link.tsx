import st from "@client/component/primitive/card-img/style/core.module.scss"
import * as fas_image from "@fortawesome/free-solid-svg-icons/faImage"
import * as faw from "@fortawesome/react-fontawesome"
import cl from "classnames"
import * as r from "react"
import * as rr from "react-router"

export type EPCardImg__ImgLink_Props = {
    readonly state_error?: boolean

    readonly href: string
    readonly src?: string | null
    readonly sizes?: string | null
    readonly srcset?: string | null
}

export const EPCardImg_ImgLink: r.FC<EPCardImg__ImgLink_Props> = props => {
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

    return <rr.Link
        to={props.href}
        className={cl(
            st.imgc,
            st.imgc_link,
            props.state_error && st._error,
        )}
    >
        {child}
    </rr.Link>
}

export default EPCardImg_ImgLink
