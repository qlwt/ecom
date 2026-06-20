import st from "@client/component/feature/console-contacts/style/page.module.scss"
import * as asr from "@qyu/atom-state-react"
import { ELConContacts_Head } from "@src/client/component/feature/console-contacts/local/head"
import ELConContacts_List from "@src/client/component/feature/console-contacts/local/list"
import { efconcontacts__paginator_new, type EFConContacts__PaginatorNew_Paginator } from "@src/client/component/feature/console-contacts/util/paginator_new"
import { useStateCache } from "@src/client/hook/statecache"
import * as r from "react"

let paginator_last: EFConContacts__PaginatorNew_Paginator | null = null

export type EFConContacts__Page_Props = {

}

export const EFConContacts_Page: r.FC<EFConContacts__Page_Props> = props => {
    const store = asr.useAtomStore()

    const [field_email, field_email_set] = useStateCache("efconcontacts::field_email", "")
    const [field_topic, field_topic_set] = useStateCache("efconcontacts::field_topic", "")
    const [field_content, field_content_set] = useStateCache("efconcontent::field_content", "")
    const [field_status_reviewed, field_status_reviewed_set] = useStateCache<0 | 1>("efconcontent::field_status_reviewed", 0)

    const [paginator, paginator_set] = r.useState(() => {
        if (paginator_last) {
            return paginator_last
        }

        return paginator_last = efconcontacts__paginator_new({
            store,

            search: {
                field_topic,
                field_email,
                field_content,
                field_status_reviewed,
            }
        })
    })

    r.useLayoutEffect(() => {
        paginator_set(paginator => {
            paginator.cleanup()

            return paginator_last = efconcontacts__paginator_new({
                store,

                search: {
                    field_topic,
                    field_email,
                    field_content,
                    field_status_reviewed,
                }
            })
        })
    }, [field_email, field_topic, field_content, field_status_reviewed])

    return <main className={st.page}>
        <ELConContacts_Head
            field_email={field_email}
            field_email_set={field_email_set}

            field_topic={field_topic}
            field_topic_set={field_topic_set}

            field_content={field_content}
            field_content_set={field_content_set}

            field_status_reviewed={field_status_reviewed}
            field_status_reviewed_set={field_status_reviewed_set}
        />

        <ELConContacts_List 
            paginator={paginator}
        />
    </main>
}

export default EFConContacts_Page
