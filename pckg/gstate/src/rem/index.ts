import * as capi from "@fst/capi"
import * as cst from "@fst/cst"
import { rem_new } from "@src/rem/new"
import type { Rem_Config, Rem_ConfigData_NodeConvert_Config } from "@src/rem/type/config"

const mixer_data_new = function <Autogen extends {}>(autogen: Autogen) {
    return function <Node extends {}>(node: Node, config: Rem_ConfigData_NodeConvert_Config) {
        return {
            ...node,
            ...config,
            ...autogen,
        }
    }
}

const mixer_data_std = mixer_data_new({ deleted: 0, } as const)

const config: Rem_Config = {
    acc: {
        node_convert: mixer_data_new({
            deleted: 0,
            access: cst.AccountAccess.Casual,
            status_sessional: 0,
        } as const),
    },

    acc_authemail: { node_convert: mixer_data_std, },

    img: {
        node_convert: (node, config, extra) => {
            return {
                ...node,
                ...config,

                deleted: 0,
                url_raw: extra?.files ? capi.filedef_uri_new(extra.files.img[0]) : null,
            } as const
        },
    },

    delivery_division: { node_convert: mixer_data_std, },
    ping_device: { node_convert: mixer_data_new({ deleted: 0, } as const), },
    ping_msg: { node_convert: mixer_data_new({ deleted: 0, status_checked: 0, } as const), },

    contact_message: {
        node_convert: mixer_data_new({
            deleted: 0,
            status_reviewed: 0,
        } as const),
    },

    item: { node_convert: mixer_data_std },
    item_tl: { node_convert: mixer_data_std, },
    item_refimg: { node_convert: mixer_data_std },
    item_reftag: { node_convert: mixer_data_std },
    item_tag: { node_convert: mixer_data_std },
    item_tag_tl: { node_convert: mixer_data_std, },

    tmplit: { node_convert: mixer_data_std },
    tmplit_tl: { node_convert: mixer_data_std, },
    tmplit_refimg: { node_convert: mixer_data_std },

    material: { node_convert: mixer_data_std, },
    material_tag: { node_convert: mixer_data_std, },
    material_tag_tl: { node_convert: mixer_data_std, },
    material_refimg: { node_convert: mixer_data_std, },
    material_reftag: { node_convert: mixer_data_std, },

    tmplmt: { node_convert: mixer_data_std, },
    tmplmt_tl: { node_convert: mixer_data_std, },
    tmplmt_refimg: { node_convert: mixer_data_std, },

    tmplpr: { node_convert: mixer_data_std, },
    tmplpr_tl: { node_convert: mixer_data_std, },
    tmplpr_refimg: { node_convert: mixer_data_std, },
    tmplpr_arg: { node_convert: mixer_data_std, },
    tmplpr_arg_tl: { node_convert: mixer_data_std, },
    tmplpr_arg_mat: { node_convert: mixer_data_std, },
    tmplpr_arg_mat_perm: { node_convert: mixer_data_std, },
    tmplpr_arg_bool: { node_convert: mixer_data_std, },
    tmplpr_arg_bool_tl: { node_convert: mixer_data_std, },
    tmplpr_arg_line: { node_convert: mixer_data_std, },
    tmplpr_arg_line_mark: { node_convert: mixer_data_std, },
    tmplpr_arg_line_mark_tl: { node_convert: mixer_data_std, },
    tmplpr_arg_rect: { node_convert: mixer_data_std, },
    tmplpr_arg_rect_mark: { node_convert: mixer_data_std, },
    tmplpr_arg_rect_mark_tl: { node_convert: mixer_data_std, },

    variant: { node_convert: mixer_data_std, },
    variant_tl: { node_convert: mixer_data_std, },
    prodset: { node_convert: mixer_data_std, },
    product: { node_convert: mixer_data_std, },
    product_argmat: { node_convert: mixer_data_std, },
    product_argbool: { node_convert: mixer_data_std, },
    product_argline: { node_convert: mixer_data_std, },
    product_argrect: { node_convert: mixer_data_std, },

    commision: {
        node_convert: mixer_data_new({
            deleted: 0,
            status_static: 0,
            paynment_amount: 0,
            status_delivered: 0,
        } as const)
    },

    cart_refnode: { node_convert: mixer_data_std, },
    commision_node: { node_convert: mixer_data_std },
    commision_node_tl: { node_convert: mixer_data_std },
    commision_node_refimg: { node_convert: mixer_data_std },
    commision_refnode: { node_convert: mixer_data_std },
    commision_product: { node_convert: mixer_data_std },
    commision_product_tl: { node_convert: mixer_data_std },
    commision_product_argmat: { node_convert: mixer_data_std },
    commision_product_argmat_tl: { node_convert: mixer_data_std },
    commision_product_argbool: { node_convert: mixer_data_std },
    commision_product_argbool_tl: { node_convert: mixer_data_std },
    commision_product_argline: { node_convert: mixer_data_std },
    commision_product_argline_tl: { node_convert: mixer_data_std },
    commision_product_argrect: { node_convert: mixer_data_std },
    commision_product_argrect_tl: { node_convert: mixer_data_std },
    commision_product_refimg: { node_convert: mixer_data_std },
    commision_product_argmat_refimg: { node_convert: mixer_data_std },
}

export const rem = rem_new(config)
