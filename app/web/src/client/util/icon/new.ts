import * as fac from "@fortawesome/fontawesome-svg-core"
import * as fas_trashcan from "@fortawesome/free-solid-svg-icons/faTrashCan"
import * as fas_copy from "@fortawesome/free-solid-svg-icons/faCopy"
import * as fas_check from "@fortawesome/free-solid-svg-icons/faCheck"
import * as fas_arrtop from "@fortawesome/free-solid-svg-icons/faArrowUp"
import * as fas_arrleft from "@fortawesome/free-solid-svg-icons/faArrowLeft"
import * as fas_arrright from "@fortawesome/free-solid-svg-icons/faArrowRight"
import * as fas_arrbottom from "@fortawesome/free-solid-svg-icons/faArrowDown"
import * as fas_fatarrtop from "@fortawesome/free-solid-svg-icons/faUpLong"
import * as fas_fatarrleft from "@fortawesome/free-solid-svg-icons/faLeftLong"
import * as fas_fatarrright from "@fortawesome/free-solid-svg-icons/faRightLong"
import * as fas_fatarrbottom from "@fortawesome/free-solid-svg-icons/faDownLong"
import * as fas_carettop from "@fortawesome/free-solid-svg-icons/faCaretUp"
import * as fas_caretleft from "@fortawesome/free-solid-svg-icons/faCaretLeft"
import * as fas_caretright from "@fortawesome/free-solid-svg-icons/faCaretRight"
import * as fas_caretbottom from "@fortawesome/free-solid-svg-icons/faCaretDown"
import * as fas_toggle_on from "@fortawesome/free-solid-svg-icons/faToggleOn"
import * as fas_toggle_off from "@fortawesome/free-solid-svg-icons/faToggleOff"
import * as fas_keyboard from "@fortawesome/free-solid-svg-icons/faKeyboard"
import * as fas_image from "@fortawesome/free-solid-svg-icons/faImage"
import * as fas_post from "@fortawesome/free-solid-svg-icons/faPlus"
import * as fab_telegram from "@fortawesome/free-brands-svg-icons/faTelegram"
import * as fas_phone from "@fortawesome/free-solid-svg-icons/faPhone"
import * as fab_viber from "@fortawesome/free-brands-svg-icons/faViber"
import * as fas_arrows_alth from "@fortawesome/free-solid-svg-icons/faArrowsAltH"
import * as fas_tools from "@fortawesome/free-solid-svg-icons/faTools"
import * as fas_square from "@fortawesome/free-solid-svg-icons/faSquare"
import * as fas_cube from "@fortawesome/free-solid-svg-icons/faCube"
import * as fas_cart from "@fortawesome/free-solid-svg-icons/faShoppingCart"
import * as fas_grid from "@fortawesome/free-solid-svg-icons/faTh"
import * as fas_globe from "@fortawesome/free-solid-svg-icons/faGlobe"
import * as fas_user from "@fortawesome/free-solid-svg-icons/faUser"
import * as fas_cog from "@fortawesome/free-solid-svg-icons/faCog"
import * as fas_eyeopen from "@fortawesome/free-solid-svg-icons/faEye"
import * as fas_eyeslash from "@fortawesome/free-solid-svg-icons/faEyeSlash"
import * as fas_signin from "@fortawesome/free-solid-svg-icons/faSignInAlt"
import * as fas_signout from "@fortawesome/free-solid-svg-icons/faSignOutAlt"
import * as fas_paper_plane from "@fortawesome/free-solid-svg-icons/faPaperPlane"
import * as fas_arrowTouprightInsquare from "@fortawesome/free-solid-svg-icons/faArrowUpRightFromSquare"
import type { Icon_Shortcut } from "@src/client/util/icon/type/shortcut"

export const icon_new = function(src: fac.IconDefinition | Icon_Shortcut): fac.IconDefinition {
    if (typeof src === "object") {
        return src
    }

    switch (src) {
        case "paper-plane":
            return fas_paper_plane.faPaperPlane
        case "phone":
            return fas_phone.faPhone
        case "viber":
            return fab_viber.faViber
        case "telegram":
            return fab_telegram.faTelegram
        case "copy":
            return fas_copy.faCopy
        case "fatarrow-top":
            return fas_fatarrtop.faUpLong
        case "fatarrow-left":
            return fas_fatarrleft.faLeftLong
        case "fatarrow-right":
            return fas_fatarrright.faRightLong
        case "fatarrow-bottom":
            return fas_fatarrbottom.faDownLong
        case "toggle_on":
            return fas_toggle_on.faToggleOn
        case "toggle_off":
            return fas_toggle_off.faToggleOff
        case "eye_open":
            return fas_eyeopen.faEye
        case "eye_slash":
            return fas_eyeslash.faEyeSlash
        case "cog":
            return fas_cog.faCog
        case "sign-out":
            return fas_signout.faSignOutAlt
        case "user":
            return fas_user.faUser
        case "sign-in":
            return fas_signin.faSignInAlt
        case "cart":
            return fas_cart.faShoppingCart
        case "caret-top":
            return fas_carettop.faCaretUp
        case "caret-left":
            return fas_caretleft.faCaretLeft
        case "caret-right":
            return fas_caretright.faCaretRight
        case "caret-bottom":
            return fas_caretbottom.faCaretDown
        case "arrow-top":
            return fas_arrtop.faArrowUp
        case "arrow-left":
            return fas_arrleft.faArrowLeft
        case "arrow-right":
            return fas_arrright.faArrowRight
        case "arrow-bottom":
            return fas_arrbottom.faArrowDown
        case "globe":
            return fas_globe.faGlobe
        case "grid":
            return fas_grid.faTh
        case "tools":
            return fas_tools.faTools
        case "arrows-alt-h":
            return fas_arrows_alth.faArrowsAltH
        case "square":
            return fas_square.faSquare
        case "cube":
            return fas_cube.faCube
        case "post":
            return fas_post.faPlus
        case "trashcan":
            return fas_trashcan.faTrashCan
        case "check":
            return fas_check.faCheck
        case "keyboard":
            return fas_keyboard.faKeyboard
        case "image":
            return fas_image.faImage
        case "arrow-toupright-insquare":
            return fas_arrowTouprightInsquare.faArrowUpRightFromSquare
    }
}
