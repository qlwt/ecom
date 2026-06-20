import st from "@client/component/feature/console-commisions/style/page.module.scss"
import * as asr from "@qyu/atom-state-react"
import { ELConCommisions_Head } from "@src/client/component/feature/console-commisions/local/head"
import ELConCommisions_List from "@src/client/component/feature/console-commisions/local/list"
import { efconcommisions__paginator_new, type EFConCommisions__PaginatorNew_Paginator } from "@src/client/component/feature/console-commisions/util/paginator_new"
import { useStateCache } from "@src/client/hook/statecache"
import * as r from "react"

let paginator_last: EFConCommisions__PaginatorNew_Paginator | null = null

export type EFConCommisions__Page_Props = {

}

export const EFConCommisions_Page: r.FC<EFConCommisions__Page_Props> = props => {
    const store = asr.useAtomStore()

    const [field_id_public, field_id_public_set] = useStateCache("efconcommisions::field_id_public", "")
    const [field_email, field_email_set] = useStateCache("efconcommisions::field_email", "")
    const [field_phone, field_phone_set] = useStateCache("efconcommisions::field_phone", "")
    const [field_city, field_city_set] = useStateCache("efconcommisions::field_city", "")
    const [field_region, field_region_set] = useStateCache("efconcommisions::field_region", "")
    const [field_division, field_division_set] = useStateCache("efconcommisions::field_division", "")
    const [field_name_first, field_name_first_set] = useStateCache("efconcommisions::field_name_first", "")
    const [field_name_family, field_name_family_set] = useStateCache("efconcommisions::field_name_family", "")
    const [field_name_father, field_name_father_set] = useStateCache("efconcommisions::field_name_father", "")
    const [field_status_paid, field_status_paid_set] = useStateCache<0 | 1>("efconcontent::field_status_paid", 1)
    const [field_status_delivered, field_status_delivered_set] = useStateCache<0 | 1>("efconcontent::field_status_delivered", 0)

    const [paginator, paginator_set] = r.useState(() => {
        if (paginator_last) {
            return paginator_last
        }

        return paginator_last = efconcommisions__paginator_new({
            store,

            search: {
                field_id_public,
                field_email,
                field_phone,
                field_city,
                field_region,
                field_division,
                field_name_first,
                field_name_family,
                field_name_father,
                field_status_paid,
                field_status_delivered,
            }
        })
    })

    r.useLayoutEffect(() => {
        paginator_set(paginator => {
            paginator.cleanup()

            return paginator_last = efconcommisions__paginator_new({
                store,

                search: {
                    field_id_public,
                    field_email,
                    field_phone,
                    field_city,
                    field_region,
                    field_division,
                    field_name_first,
                    field_name_family,
                    field_name_father,
                    field_status_paid,
                    field_status_delivered,
                },
            })
        })
    }, [
        field_id_public,
        field_email,
        field_phone,
        field_city,
        field_region,
        field_division,
        field_name_first,
        field_name_family,
        field_name_father,
        field_status_paid,
                field_status_delivered,
    ])

    return <main className={st.page}>
        <ELConCommisions_Head
            field_id_public={field_id_public}
            field_id_public_set={field_id_public_set}

            field_email={field_email}
            field_email_set={field_email_set}

            field_phone={field_phone}
            field_phone_set={field_phone_set}

            field_city={field_city}
            field_city_set={field_city_set}

            field_region={field_region}
            field_region_set={field_region_set}

            field_division={field_division}
            field_division_set={field_division_set}

            field_name_first={field_name_first}
            field_name_first_set={field_name_first_set}

            field_name_family={field_name_family}
            field_name_family_set={field_name_family_set}

            field_name_father={field_name_father}
            field_name_father_set={field_name_father_set}

            field_status_paid={field_status_paid}
            field_status_paid_set={field_status_paid_set}

            field_status_delivered={field_status_delivered}
            field_status_delivered_set={field_status_delivered_set}
        />

        <ELConCommisions_List
            paginator={paginator}
        />
    </main>
}

export default EFConCommisions_Page
