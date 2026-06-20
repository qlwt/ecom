import st from "@client/component/feature/sign/style/core.module.scss"
import st_intext from "@client/component/primitive/in-text/style/white.module.scss"
import { efsign__validate_code } from "@src/client/component/feature/sign/util/validate/code"
import { efsign__validate_pass } from "@src/client/component/feature/sign/util/validate/pass"
import { EPInText_IconBtn } from "@src/client/component/primitive/in-text/element/icon_btn"
import EPInText_Input from "@src/client/component/primitive/in-text/element/input"
import EPInText_ViewWeak from "@src/client/component/primitive/in-text/element/view_weak"
import cl from "classnames"
import * as r from "react"
import * as ri18 from "react-i18next"

export type EFSign__PagePassRestoreFill_Props = {

}

export const EFSign_PagePassRestoreFill: r.FC<EFSign__PagePassRestoreFill_Props> = props => {
    const { t } = ri18.useTranslation()

    const id_email = r.useId()
    const id_pass = r.useId()
    const id_passrep = r.useId()

    const [hidepass, hidepass_set] = r.useState(false)

    const [code, code_set] = r.useState("")
    const [pass, pass_set] = r.useState("")
    const [passrep, passrep_set] = r.useState("")

    const passrep_error = passrep !== pass
    const pass_error = !efsign__validate_pass(pass)
    const code_error = !efsign__validate_code(code)

    return <main className={st.root}>
        <div className={st.form}>
            <div className={cl(st.line, st._header)}>
                <h1 className={st.header}>
                    {t(`sign.header_restore_password`)}
                </h1>
            </div>

            <div className={cl(st.line, st._field)}>
                <div className={st.label__view}>
                    <label htmlFor={id_email} className={st.label__text}>
                        {t(`sign.label_restorecode`)}
                    </label>
                </div>

                <EPInText_ViewWeak
                    stmod={st_intext}
                    value={``}
                    value_validator={v => v === "" || efsign__validate_code(code)}
                >
                    <EPInText_Input
                        id={id_email}
                        placeholder={`000000`}

                        event_value_change={code_set}
                    />
                </EPInText_ViewWeak>
            </div>

            <div className={cl(st.line, st._field)}>
                <div className={st.label__view}>
                    <label htmlFor={id_pass} className={st.label__text}>
                        {t(`sign.label_new_password`)}
                    </label>
                </div>

                <EPInText_ViewWeak
                    stmod={st_intext}
                    value={pass}

                    value_validator={value => value === "" || efsign__validate_pass(value)}
                >
                    <EPInText_Input
                        id={id_pass}
                        type={hidepass ? `password` : `text`}
                        placeholder={t(`sign.placeholder_new_password`)}

                        event_value_change={pass_set}
                    />

                    <EPInText_IconBtn
                        icon={hidepass ? `eye_slash` : `eye_open`}

                        event_click={() => {
                            hidepass_set(o => !o)
                        }}
                    />
                </EPInText_ViewWeak>
            </div>

            <div className={cl(st.line, st._field)}>
                <div className={st.label__view}>
                    <label htmlFor={id_passrep} className={st.label__text}>
                        {t(`sign.label_repeat_password`)}
                    </label>
                </div>

                <EPInText_ViewWeak
                    stmod={st_intext}
                    value={passrep}
                    value_validator={value => value === "" || value === pass}
                >
                    <EPInText_Input
                        id={id_passrep}
                        type={hidepass ? `password` : `text`}
                        placeholder={t(`sign.placeholder_repeat_password`)}

                        event_value_change={passrep_set}
                    />

                    <EPInText_IconBtn
                        icon={hidepass ? `eye_slash` : `eye_open`}

                        event_click={() => {
                            hidepass_set(o => !o)
                        }}
                    />
                </EPInText_ViewWeak>
            </div>

            <div className={cl(st.line, st._button)}>
                <button
                    className={st.form__btn}
                    disabled={pass_error || passrep_error || code_error}
                >
                    {t(`commons.change_password`)}
                </button>
            </div>
        </div>
    </main>
}

export default EFSign_PagePassRestoreFill

