export const urlmap = {
    console: {
        contacts: () => `/contacts`,
        commisions: () => `/commisions`,

        edit_item: (params: { id: string } | null) => {
            return `/edit/item/${params?.id ?? `:id`}`
        },

        edit_material: (params: { id: string } | null) => {
            return `/edit/material/${params?.id ?? `:id`}`
        },

        edit_tmplit: (params: { id: string } | null) => {
            return `/edit/tmplit/${params?.id ?? `:id`}`
        },

        edit_tmplpr: (params: { id: string } | null) => {
            return `/edit/tmplpr/${params?.id ?? `:id`}`
        },

        edit_tmplmt: (params: { id: string } | null) => {
            return `/edit/tmplmt/${params?.id ?? `:id`}`
        },
    },

    public: {
        tracker: () => `/tracker`,
        contact: () => `/contact`,

        view_item: (params: { id: string } | null) => {
            return `/home-view/item/${params?.id ?? `:id`}`
        },
    },

    shared: {
        root: () => `/`,
        sign_in: () => `/user-signin`,
        sign_up: () => `/user-signup`,
        sign_restorepass_send: () => `/user-passrestore-send`,
        sign_restorepass_fill: () => `/user-passrestore-fill`,

        commision_finish: () => `/commision-finish`,

        commision_view: (params: { id: string } | null) => {
            return `/commision-view/${params?.id ?? ":id"}`
        },

        acc: () => `/acc-profile`,
        acc_info: () => `/acc-profile/info`,
        acc_contact: () => `/acc-profile/contact`,
        acc_commision: () => `/acc-profile/commision`,
    },
}
