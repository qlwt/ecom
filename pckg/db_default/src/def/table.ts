import * as cc from "@fst/config/client"
import * as cst from "@fst/cst"

export const table = {
    delivery_division: {
    },

    acc: {
    },

    img: {
    },

    acc_authemail: {
    },

    ping_msg: {
    },

    ping_device: {
    },

    commision: {
        contact_email: "",
        contact_phone: "",
        contact_fname: "",
        contact_lname: "",
        contact_pname: "",
        delivery_division__id: null,
    },

    cart_refnode: {
        quantity: 1,
    },

    commision_refnode: {
        quantity: 1,
    },

    commision_node: {
    },

    commision_node_tl: {
        tltable: {},
    },

    commision_product: {
        price_formula: "",
        quantity: 1,
    },

    commision_product_tl: {
        tltable: {},
    },

    commision_product_refimg: {

    },

    commision_node_refimg: {
    },

    commision_product_argline: {
    },

    commision_product_argline_tl: {
        tltable: {},
    },

    commision_product_argrect: {
    },

    commision_product_argrect_tl: {
        tltable: {},
    },

    commision_product_argbool: {
    },

    commision_product_argbool_tl: {
        tltable: {},
    },

    commision_product_argmat: {
    },

    commision_product_argmat_tl: {
        tltable: {},
    },

    commision_product_argmat_refimg: {

    },

    item: {
        name: "new_item"
    },

    item_tl: {
        tltable: {},
    },

    item_refimg: {
    },

    item_tag: {
        name: "new_tag",
    },

    item_tag_tl: {
        tltable: {},
    },

    tmplit: {
        name: "new_tmplit"
    },

    tmplit_tl: {
        tltable: {},
    },

    tmplit_refimg: {
    },


    item_reftag: {
    },

    variant: {
        header: "new_variant",
        description: "new_description",
    },

    variant_tl: {
        tltable: {},
    },

    prodset: {
    },

    product: {
        quantity: 1,
    },

    product_argbool: {

    },

    product_argline: {
    },

    product_argrect: {
    },

    product_argmat: {
        value: null,
    },

    tmplpr: {
        name: "new_tmplpr",
        price_formula: "0",
    },

    tmplpr_tl: {
        tltable: {},
    },

    tmplpr_refimg: {
    },

    tmplpr_arg: {
        hidden_formula: "",
        name: "new_tmplpr_arg",
        kind: cst.TmplPrArg_Kind.Line,
    },

    tmplpr_arg_tl: {
        tltable: {},
    },

    tmplpr_arg_mat: {
    },

    tmplpr_arg_mat_perm: {
    },

    tmplpr_arg_bool: {
        value_def: 0,
        title_true: "true",
        title_false: "false",
    },

    tmplpr_arg_bool_tl: {
        tltable: {},
    },

    tmplpr_arg_line: {
        x_value_step: 1,
        x_value_def: 50,
        x_bound_min: 10,
        x_bound_max: 100,
    },

    tmplpr_arg_line_mark: {
        x_value: 40,
        label: "new_mark",
    },

    tmplpr_arg_line_mark_tl: {
        tltable: {},
    },

    tmplpr_arg_rect: {
        x_value_def: 50,
        x_value_step: 1,
        x_bound_min: 10,
        x_bound_max: 100,

        y_value_def: 50,
        y_value_step: 1,
        y_bound_min: 10,
        y_bound_max: 100,
    },

    tmplpr_arg_rect_mark: {
        x_value: 40,
        y_value: 40,
        label: "new_mark",
    },

    tmplpr_arg_rect_mark_tl: {
        tltable: {},
    },

    material: {
        status_available: 1,
    },

    material_refimg: {
    },

    material_tag: {
        name: "new_tag",
    },

    material_tag_tl: {
        tltable: {},
    },

    material_reftag: {
    },

    tmplmt: {
        name: "new_tmplmt",
    },

    tmplmt_tl: {
        tltable: {},
    },

    tmplmt_refimg: {
    },

    contact_message: {
    },
} satisfies ((
    & {
        [K in keyof cc.RestData]: Partial<cc.Rest[K]["post"]["body"][number]["core"]>
    }
    & {
        [K in keyof cc.RestImg]: Partial<cc.Rest[K]["post"]["body"]>
    }
))
