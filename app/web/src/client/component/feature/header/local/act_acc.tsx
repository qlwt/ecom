import { remx } from "@fst/gstate"
import * as asr from "@qyu/atom-state-react"
import * as ddn from "@qyu/reactcmp-dropdown"
import * as sc from "@qyu/signal-core"
import * as sr from "@qyu/signal-react"
import st from "@src/client/component/feature/header/style/act.module.scss"
import EPIcon_FA from "@src/client/component/primitive/icon/element/view"
import { domroot_dropdown } from "@src/client/const/domroot"
import { urlmap } from "@src/client/urlmap"
import cl from "classnames"
import * as r from "react"
import * as ri18 from "react-i18next"
import * as rr from "react-router"

export type ELHeader__ActAcc_Props = {

}

export const ELHeader_ActAcc: r.FC<ELHeader__ActAcc_Props> = props => {
    const { t } = ri18.useTranslation()
    const { reg } = asr.useAtomStore()

    const acc = sr.useSignalOutput(asr.useAtomValue(
        r.useCallback(({ reg }) => {
            return sc.osignal_new_memo(sc.osignal_new_pipe(
                reg(remx.auth.joins.core())({}),
                join => join?.data ?? null
            ), null)
        }, [])
    ))

    asr.useAtomLoader({
        atomloader: remx.auth.loaders.check,
        params: []
    })

    if (acc?.status_sessional !== 0) {
        return <rr.Link to={urlmap.shared.sign_in()} className={cl(st.root, st._user)}>
            <EPIcon_FA def={`sign-in`} />
        </rr.Link>
    } else {
        return <ddn.CmpContainerVirtual>
            <ddn.CmpButton className={cl(st.root, st._user)}>
                <EPIcon_FA def={`user`} />
            </ddn.CmpButton>

            <ddn.CmpListPortal portal={domroot_dropdown} align={`center`} gap={2} className={cl(st.ddnlist, st._user)}>
                {() => <ddn.CmpContent className={cl(st.ddncontent)}>
                    <div className={st.list}>
                        <rr.Link to={urlmap.shared.acc_info()} className={cl(st.list__btn, st._withicon)}>
                            <EPIcon_FA def={`cog`} />

                            <span>
                                {t("nav.user_profile")}
                            </span>
                        </rr.Link>

                        <button
                            className={cl(st.list__btn, st._withicon)}

                            onClick={() => {
                                reg(remx.auth.act.signout({
                                    config: {
                                        events: {
                                            cleanup: () => {
                                                window.location.reload()
                                            }
                                        }
                                    },
                                }))
                            }}
                        >
                            <EPIcon_FA def={`sign-out`} />

                            <span>
                                {t("nav.user_logout")}
                            </span>
                        </button>
                    </div>
                </ddn.CmpContent>}
            </ddn.CmpListPortal>
        </ddn.CmpContainerVirtual>
    }
}

export default ELHeader_ActAcc
