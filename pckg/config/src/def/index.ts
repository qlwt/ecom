import * as cst from "@fst/cst";
import type { DefServer } from "@src/def/type/server";
import { field_new_raw } from "@src/field/new/raw";
import { field_new_str } from "@src/field/new/str";
import { ftype_new } from "@src/ftype/new";
import { rest_getquery_new, rest_new_data } from "@src/rest/new/data";
import { rest_new_img } from "@src/rest/new/img";
import { table_new_local } from "@src/table/new/local";
import { table_new_public_data } from "@src/table/new/public_data";
import { table_new_public_img } from "@src/table/new/public_img";

const int_regexp = /^[0-9][0-9]*$/

const enumvariants_new = function <T>(src: { [K in string]: any }): T[] {
    const variants: T[] = []

    for (const key of Object.keys(src)) {
        if (!key.match(int_regexp)) {
            variants.push(src[key]!)
        }
    }

    return variants
}

export const def = {
    table_local: {
        timestamp_deliveryupdate: table_new_local({
            fields: {
                id: field_new_raw(ftype_new("int16"), { status_static: true, status_primary: true, }),
                timestamp_unix: field_new_raw(ftype_new("int64"), {}),
            },
        }),

        img_variant: table_new_local({
            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                area: "int32 static autogen",
                filename: "text static autogen",
                mimetype: "text static autogen",
                img__id: "uuid static indexed $img->id",
            },
        }),
    },

    table_public: {
        ping_device: table_new_public_data({
            rest: rest_new_data({
                get: {
                    kind: "std",

                    query: rest_getquery_new({
                        pick_token: ftype_new({
                            kind: "array",
                            child: ftype_new("text"),
                        }, { status_optional: true, }),
                    }),
                },
            }),

            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                token: "text static indexed",
            },
        }),

        ping_msg: table_new_public_data({
            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                phone: "text",
                owner: "uuid static indexed",
                status_checked: "bool autogen",

                cmethod: field_new_raw(
                    ftype_new({
                        kind: "enum-int",
                        name: "cst.PingMe_ContactMethod",
                        variants: enumvariants_new(cst.PingMe_ContactMethod),
                    }),
                    {
                        status_static: true,
                        status_indexed: true,
                    }
                ),
            },
        }),

        acc: table_new_public_data({
            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                access: "int16 static autogen",
                status_sessional: "bool static autogen",

                contact_email: "text",
                contact_phone: "text",
                contact_fname: "text",
                contact_lname: "text",
                contact_pname: "text",
                delivery_division__id: "?uuid indexed $delivery_division->id",
            } as const,
        }),

        img: table_new_public_img({
            table_variant: "img_variant",

            rest: rest_new_img({
            }),

            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",
            },
        }),

        delivery_division: table_new_public_data({
            rest: rest_new_data({
                get: {
                    kind: "std",

                    query: rest_getquery_new({
                        pick_cities: ftype_new({
                            kind: "array",
                            child: ftype_new({ kind: "int64", }),
                        }, { status_optional: true, }),

                        pick_parents: ftype_new({
                            kind: "array",
                            child: ftype_new({ kind: "int64", }),
                        }, { status_optional: true, }),
                    })
                }
            }),

            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                address: "text static",
                address_city: "text static",
                address_region: "text static",
                address_postcode: "text static",
                address_building: "text static",

                name_full: "text static",
                name_short: "text static indexed",
                owner: "text static",
                source: "text static",
                category: "text static indexed",

                latitude: "double static",
                longitude: "double static",

                numid: "int64 static unique indexed",
                externalid: "text static indexed",

                status_text: "text static indexed",
                status_available: "bool static indexed",

                parent_name: "text static indexed",
                parent_numid: "int64 static indexed",

                city_name: "text static indexed",
                city_numid: "int64 static indexed",

                country_code: "text static indexed",
            },
        }),

        contact_message: table_new_public_data({
            rest: rest_new_data({
                get: {
                    kind: "std",

                    query: rest_getquery_new({
                        search: ftype_new("search", { status_optional: true, }),
                    }),
                },
            }),

            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                topic: "text",
                content: "text",
                email: "text",
                status_reviewed: "bool autogen",
                owner: "?uuid static indexed $acc->id",
            },
        }),

        acc_authemail: table_new_public_data({
            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                email: "text static",
                password_hash: "text private",
                password_salt: "text private",

                owner: field_new_str("uuid static indexed $acc->id"),
            },
        }),

        tmplit: table_new_public_data({
            rest: rest_new_data({
                get: {
                    kind: "std",

                    query: rest_getquery_new({
                        search: ftype_new("search", { status_optional: true, }),
                    }),
                },
            }),

            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                name: "text indexed",
                status_hidden: "bool indexed",
            },

            joins: {
                core: {
                    tl: "id<-$tmplit_tl->source__id::core",
                    refimgs: "id<-$tmplit_refimg->tmplit__id::core",
                },
            }
        }),

        tmplit_tl: table_new_public_data({
            rest: rest_new_data({
                get: {
                    kind: "std",

                    query: rest_getquery_new({
                        pick_source__id: ftype_new({
                            kind: "array",
                            child: ftype_new("uuid", { status_optional: true, }),
                        }, { status_optional: true }),
                    }),
                },
            }),

            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                lang: "text static",
                tltable: "record_text",
                source__id: "uuid static indexed $tmplit->id",
            },
        }),

        tmplit_refimg: table_new_public_data({
            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                img__id: "uuid static indexed $img->id",
                tmplit__id: "uuid static indexed $tmplit->id",
            },

            joins: {
                core: {
                    img: "img__id->$img->id::core",
                },
            },
        }),

        item: table_new_public_data({
            rest: rest_new_data({
                get: {
                    kind: "std",

                    query: rest_getquery_new({
                        pick_tmplit__id: ftype_new(
                            { kind: "array", child: ftype_new("uuid") },
                            { status_optional: true, }
                        ),

                        filter_tag__id: ftype_new(
                            { kind: "array", child: ftype_new("uuid") }, 
                            { status_optional: true }
                        ),

                        search: ftype_new("search", { status_optional: true, }),
                    }),
                },
            }),

            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                name: "text indexed",
                status_hidden: "bool indexed",
                tmplit__id: "uuid static indexed $tmplit->id",
            },

            joins: {
                core: {
                    tl: "id<-$item_tl->source__id::core",
                    variants: "id<-$variant->item__id::core",
                    template: "tmplit__id->$tmplit->id::core",
                    refimgs: "id<-$item_refimg->item__id::core",
                    reftags: "id<-$item_reftag->item__id::core",
                },
            },
        }),

        item_tl: table_new_public_data({
            rest: rest_new_data({
                get: {
                    kind: "std",

                    query: rest_getquery_new({
                        pick_source__id: ftype_new({
                            kind: "array",
                            child: ftype_new("uuid", { status_optional: true, }),
                        }, { status_optional: true }),
                    }),
                },
            }),

            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                lang: "text static",
                tltable: "record_text",
                source__id: "uuid static indexed $item->id",
            },
        }),

        item_refimg: table_new_public_data({
            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                img__id: "uuid static indexed $img->id",
                item__id: "uuid static indexed $item->id",
            },

            joins: {
                core: {
                    img: "img__id->$img->id::core",
                },
            },
        }),

        item_tag: table_new_public_data({
            rest: rest_new_data({
                get: {
                    kind: "std",

                    query: rest_getquery_new({
                        filter_tmplit__id: ftype_new(
                            { kind: "array", child: ftype_new("uuid") }, 
                            { status_optional: true }
                        ),
                    }),
                },
            }),

            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                name: "text indexed",
                status_hidden: "bool indexed",
            },

            joins: {
                core: {
                    tl: "id<-$item_tag_tl->source__id::core",
                },
            },
        }),

        item_tag_tl: table_new_public_data({
            rest: rest_new_data({
                get: {
                    kind: "std",

                    query: rest_getquery_new({
                        pick_source__id: ftype_new({
                            kind: "array",
                            child: ftype_new("uuid", { status_optional: true, }),
                        }, { status_optional: true }),
                    }),
                },
            }),

            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                lang: "text static",
                tltable: "record_text",
                source__id: "uuid static indexed $item_tag->id",
            },
        }),

        item_reftag: table_new_public_data({
            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                item__id: "uuid static indexed $item->id",
                item_tag__id: "uuid static indexed $item_tag->id",
            },

            joins: {
                core: {
                    tag: "item_tag__id->$item_tag->id::core",
                },
            },
        }),

        prodset: table_new_public_data({
            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                owner: "?uuid static indexed $acc->id",
            },

            joins: {
                core: {
                    products: "id<-$product->prodset__id::core",
                },
            },
        }),

        variant: table_new_public_data({
            rest: rest_new_data({
                get: {
                    kind: "std",

                    query: rest_getquery_new({
                        pick_item__id: ftype_new(
                            { kind: "array", child: ftype_new("uuid") },
                            { status_optional: true, }
                        ),
                    }),
                },
            }),

            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                header: "text",
                description: "text",
                status_hidden: "bool indexed",
                owner: "?uuid static indexed $acc->id",

                prodset__id: "uuid static $prodset->id",
                item__id: "uuid static indexed $item->id",
            },

            joins: {
                core: {
                    prodset: "prodset__id->$prodset->id::core",
                    tl: "id<-$variant_tl->source__id::core",
                },
            },
        }),

        variant_tl: table_new_public_data({
            rest: rest_new_data({
                get: {
                    kind: "std",

                    query: rest_getquery_new({
                        pick_source__id: ftype_new({
                            kind: "array",
                            child: ftype_new("uuid", { status_optional: true, }),
                        }, { status_optional: true }),
                    }),
                },
            }),

            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                lang: "text static",
                tltable: "record_text",
                owner: "?uuid static indexed $acc->id",
                source__id: "uuid static indexed $variant->id",
            },
        }),

        tmplmt: table_new_public_data({
            rest: rest_new_data({
                get: {
                    kind: "std",

                    query: rest_getquery_new({
                        search: ftype_new("search", { status_optional: true, }),
                    }),
                },
            }),

            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                name: "text",
                status_hidden: "bool",
            },

            joins: {
                core: {
                    tl: "id<-$tmplmt_tl->source__id::core",
                    refimgs: "id<-$tmplmt_refimg->tmplmt__id::core",
                },
            },
        }),

        tmplmt_tl: table_new_public_data({
            rest: rest_new_data({
                get: {
                    kind: "std",

                    query: rest_getquery_new({
                        pick_source__id: ftype_new({
                            kind: "array",
                            child: ftype_new("uuid", { status_optional: true, }),
                        }, { status_optional: true }),
                    }),
                },
            }),

            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                lang: "text static",
                tltable: "record_text",
                source__id: "uuid static indexed $tmplmt->id",
            },
        }),

        tmplmt_refimg: table_new_public_data({
            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                img__id: "uuid static indexed $img->id",
                tmplmt__id: "uuid static indexed $tmplmt->id",
            },

            joins: {
                core: {
                    img: "img__id->$img->id::core",
                },
            },
        }),

        material: table_new_public_data({
            rest: rest_new_data({
                get: {
                    kind: "std",

                    query: rest_getquery_new({
                        search: ftype_new("search", { status_optional: true, }),

                        pick_tmplmt__id: ftype_new(
                            { kind: "array", child: ftype_new("uuid") },
                            { status_optional: true, }
                        ),
                    }),
                },
            }),

            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                status_hidden: "bool indexed",
                status_available: "bool indexed",
                tmplmt__id: "uuid static indexed $tmplmt->id",
            },

            joins: {
                core: {
                    template: "tmplmt__id->$tmplmt->id::core",
                    reftags: "id<-$material_reftag->material__id::core",
                    refimgs: "id<-$material_refimg->material__id::core",
                },
            },
        }),

        material_refimg: table_new_public_data({
            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                img__id: "uuid static indexed $img->id",
                material__id: "uuid static indexed $material->id",
            },

            joins: {
                core: {
                    img: "img__id->$img->id::core",
                },
            },
        }),

        material_tag: table_new_public_data({
            rest: rest_new_data({
                get: {
                    kind: "std",

                    query: rest_getquery_new({
                        filter_tmplmt__id: ftype_new(
                            { kind: "array", child: ftype_new("uuid") }, 
                            { status_optional: true }
                        ),
                    }),
                },
            }),

            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                name: "text indexed",
                status_hidden: "bool indexed",
            },

            joins: {
                core: {
                    tl: "id<-$material_tag_tl->source__id::core",
                },
            },
        }),

        material_tag_tl: table_new_public_data({
            rest: rest_new_data({
                get: {
                    kind: "std",

                    query: rest_getquery_new({
                        pick_source__id: ftype_new({
                            kind: "array",
                            child: ftype_new("uuid", { status_optional: true, }),
                        }, { status_optional: true }),
                    }),
                },
            }),

            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                lang: "text static",
                tltable: "record_text",
                source__id: "uuid static indexed $material_tag->id",
            },
        }),

        material_reftag: table_new_public_data({
            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                material__id: "uuid static indexed $material->id",
                material_tag__id: "uuid static indexed $material_tag->id",
            },

            joins: {
                core: {
                    tag: "material_tag__id->$material_tag->id::core",
                },
            },
        }),

        tmplpr: table_new_public_data({
            rest: rest_new_data({
                get: {
                    kind: "std",

                    query: rest_getquery_new({
                        search: ftype_new("search", { status_optional: true, }),
                    }),
                },
            }),

            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                status_hidden: "bool indexed",

                price_formula: "formula",
                name: "text indexed",
            },

            joins: {
                core: {
                    tl: "id<-$tmplpr_tl->source__id::core",
                    args: "id<-$tmplpr_arg->tmplpr__id::core",
                    refimgs: "id<-$tmplpr_refimg->tmplpr__id::core",
                },
            },
        }),

        tmplpr_tl: table_new_public_data({
            rest: rest_new_data({
                get: {
                    kind: "std",

                    query: rest_getquery_new({
                        pick_source__id: ftype_new({
                            kind: "array",
                            child: ftype_new("uuid", { status_optional: true, }),
                        }, { status_optional: true }),
                    }),
                },
            }),

            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                lang: "text static",
                tltable: "record_text",
                source__id: "uuid static indexed $tmplpr->id",
            },
        }),

        tmplpr_refimg: table_new_public_data({
            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                img__id: "uuid static indexed $img->id",
                tmplpr__id: "uuid static indexed $tmplpr->id",
            },

            joins: {
                core: {
                    img: "img__id->$img->id::core",
                },
            },
        }),

        tmplpr_arg: table_new_public_data({
            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                name: "text",
                hidden_formula: "formula",
                tmplpr__id: "uuid static indexed $tmplpr->id",

                kind: field_new_raw(ftype_new({
                    kind: "enum-int",
                    name: "cst.TmplPrArg_Kind",
                    variants: enumvariants_new<cst.TmplPrArg_Kind>(cst.TmplPrArg_Kind)
                }), { status_indexed: true, }),
            },

            joins: {
                core: {
                    tl: "id<-$tmplpr_arg_tl->source__id::core",
                    defs_mat: "id<-$tmplpr_arg_mat->tmplpr_arg__id::core",
                    defs_line: "id<-$tmplpr_arg_line->tmplpr_arg__id::core",
                    defs_rect: "id<-$tmplpr_arg_rect->tmplpr_arg__id::core",
                    defs_bool: "id<-$tmplpr_arg_bool->tmplpr_arg__id::core",
                },
            },
        }),

        tmplpr_arg_tl: table_new_public_data({
            rest: rest_new_data({
                get: {
                    kind: "std",

                    query: rest_getquery_new({
                        pick_source__id: ftype_new({
                            kind: "array",
                            child: ftype_new("uuid", { status_optional: true, }),
                        }, { status_optional: true }),
                    }),
                },
            }),

            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                lang: "text static",
                tltable: "record_text",
                source__id: "uuid static indexed $tmplpr_arg->id",
            },
        }),

        tmplpr_arg_line: table_new_public_data({
            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                x_value_def: "int32",
                x_bound_min: "int32",
                x_bound_max: "int32",
                x_value_step: "int32",

                tmplpr_arg__id: "uuid static indexed $tmplpr_arg->id",
            },

            joins: {
                core: {
                    marks: "id<-$tmplpr_arg_line_mark->tmplpr_arg_line__id::core",
                },
            },
        }),

        tmplpr_arg_line_mark: table_new_public_data({
            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                x_value: "int32",
                label: "text",

                tmplpr_arg_line__id: "uuid $tmplpr_arg_line->id",
            },

            joins: {
                core: {
                    tl: "id<-$tmplpr_arg_line_mark_tl->source__id::core",
                },
            },
        }),

        tmplpr_arg_line_mark_tl: table_new_public_data({
            rest: rest_new_data({
                get: {
                    kind: "std",

                    query: rest_getquery_new({
                        pick_source__id: ftype_new({
                            kind: "array",
                            child: ftype_new("uuid", { status_optional: true, }),
                        }, { status_optional: true }),
                    }),
                },
            }),

            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                lang: "text static",
                tltable: "record_text",
                source__id: "uuid static indexed $tmplpr_arg_line_mark->id",
            },
        }),

        tmplpr_arg_rect: table_new_public_data({
            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                x_value_def: "int32",
                x_bound_min: "int32",
                x_bound_max: "int32",
                x_value_step: "int32",
                y_value_def: "int32",
                y_bound_min: "int32",
                y_bound_max: "int32",
                y_value_step: "int32",

                tmplpr_arg__id: "uuid static indexed $tmplpr_arg->id",
            },

            joins: {
                core: {
                    marks: "id<-$tmplpr_arg_rect_mark->tmplpr_arg_rect__id::core",
                },
            },
        }),

        tmplpr_arg_rect_mark: table_new_public_data({
            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                x_value: "int32",
                y_value: "int32",
                label: "text",

                tmplpr_arg_rect__id: "uuid $tmplpr_arg_rect->id",
            },

            joins: {
                core: {
                    tl: "id<-$tmplpr_arg_rect_mark_tl->source__id::core",
                },
            },
        }),

        tmplpr_arg_rect_mark_tl: table_new_public_data({
            rest: rest_new_data({
                get: {
                    kind: "std",

                    query: rest_getquery_new({
                        pick_source__id: ftype_new({
                            kind: "array",
                            child: ftype_new("uuid", { status_optional: true, }),
                        }, { status_optional: true }),
                    }),
                },
            }),

            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                lang: "text static",
                tltable: "record_text",
                source__id: "uuid static indexed $tmplpr_arg_rect_mark->id",
            },
        }),

        tmplpr_arg_bool: table_new_public_data({
            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                value_def: "bool",
                title_true: "text",
                title_false: "text",

                tmplpr_arg__id: "uuid static indexed $tmplpr_arg->id",
            },

            joins: {
                core: {
                    tl: "id<-$tmplpr_arg_bool_tl->source__id::core",
                },
            },
        }),

        tmplpr_arg_bool_tl: table_new_public_data({
            rest: rest_new_data({
                get: {
                    kind: "std",

                    query: rest_getquery_new({
                        pick_source__id: ftype_new({
                            kind: "array",
                            child: ftype_new("uuid", { status_optional: true, }),
                        }, { status_optional: true }),
                    }),
                },
            }),

            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                lang: "text static",
                tltable: "record_text",
                source__id: "uuid static indexed $tmplpr_arg_bool->id",
            },
        }),

        tmplpr_arg_mat: table_new_public_data({
            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                tmplpr_arg__id: "uuid static indexed $tmplpr_arg->id",
            },

            joins: {
                core: {
                    perms: "id<-$tmplpr_arg_mat_perm->tmplpr_arg_mat__id::core",
                },
            },
        }),

        tmplpr_arg_mat_perm: table_new_public_data({
            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                tmplmt__id: "?uuid static indexed $tmplmt->id",
                tmplpr_arg_mat__id: "uuid static indexed $tmplpr_arg_mat->id",
            },

            joins: {
                core: {
                    template: "tmplmt__id->$tmplmt->id::core"
                },
            },
        }),

        product: table_new_public_data({
            rest: rest_new_data({
                get: {
                    kind: "std",

                    query: rest_getquery_new({
                        pick_tmplpr__id: ftype_new(
                            { kind: "array", child: ftype_new("uuid") },
                            { status_optional: true, }
                        ),
                    }),
                },
            }),

            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                quantity: "int32",
                owner: "?uuid static indexed $acc->id",

                tmplpr__id: "uuid $tmplpr->id",
                prodset__id: "uuid $prodset->id",
            },

            joins: {
                core: {
                    template: "tmplpr__id->$tmplpr->id::core",
                    argimps_line: "id<-$product_argline->product__id::core",
                    argimps_rect: "id<-$product_argrect->product__id::core",
                    argimps_mat: "id<-$product_argmat->product__id::core",
                    argimps_bool: "id<-$product_argbool->product__id::core",
                },
            },
        }),

        product_argline: table_new_public_data({
            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                x_value: "int32",
                owner: "?uuid static indexed $acc->id",

                product__id: "uuid static $product->id",
                tmplpr_arg_line__id: "uuid static $tmplpr_arg_line->id"
            },
        }),

        product_argrect: table_new_public_data({
            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                x_value: "int32",
                y_value: "int32",
                owner: "?uuid static indexed $acc->id",

                product__id: "uuid static $product->id",
                tmplpr_arg_rect__id: "uuid static $tmplpr_arg_rect->id"
            },
        }),

        product_argmat: table_new_public_data({
            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                value: "?uuid $material->id",
                owner: "?uuid static indexed $acc->id",

                product__id: "uuid static $product->id",
                tmplpr_arg_mat__id: "uuid static $tmplpr_arg_mat->id"
            },

            joins: {
                core: {
                    value: "value?->$material->id::core",
                },
            },
        }),

        product_argbool: table_new_public_data({
            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                value: "bool",
                owner: "?uuid static indexed $acc->id",

                product__id: "uuid static $product->id",
                tmplpr_arg_bool__id: "uuid static $tmplpr_arg_bool->id"
            },
        }),

        cart_refnode: table_new_public_data({
            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                quantity: "int32",

                owner: "uuid static indexed $acc->id",
                commision_node__id: "uuid static indexed $commision_node->id",
            },

            joins: {
                core: {
                    node: "commision_node__id->$commision_node->id::core"
                },
            },
        }),

        commision: table_new_public_data({
            rest: rest_new_data({
                get: {
                    kind: "std",

                    query: rest_getquery_new({
                        search: ftype_new("search", { status_optional: true, }),
                        id_public: ftype_new("text", { status_optional: true, }),
                    })
                },
            }),

            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                id_public: "text static indexed",
                owner: "?uuid static indexed $acc->id",

                status_static: "bool indexed",
                paynment_amount: "int32 indexed autogen",
                status_delivered: "bool indexed autogen",

                contact_email: "text indexed",
                contact_phone: "text indexed",
                contact_fname: "text indexed",
                contact_lname: "text indexed",
                contact_pname: "text indexed",
                delivery_division__id: "?uuid $delivery_division->id",
            },

            joins: {
                core: {
                    refnodes: "id<-$commision_refnode->commision__id::core",
                    delivery_division: "delivery_division__id?->$delivery_division->id::core",
                },
            },
        }),

        commision_refnode: table_new_public_data({
            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                quantity: "int32",

                owner: "?uuid static indexed $acc->id",
                commision__id: "uuid static indexed $commision->id",
                commision_node__id: "uuid static indexed $commision_node->id",
            },

            joins: {
                core: {
                    node: `commision_node__id->$commision_node->id::core`
                },
            },
        }),

        commision_node: table_new_public_data({
            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                item_name: "text static",
                tmplit_name: "text static",
                variant_header: "text static",
                owner: "?uuid static indexed $acc->id",

                item__id: "?uuid static $item->id",
                tmplit__id: "?uuid static $tmplit->id",
                variant__id: "?uuid static $variant->id",
            },

            joins: {
                core: {
                    tl: "id<-$commision_node_tl->source__id::core",
                    refimgs: "id<-$commision_node_refimg->commision_node__id::core",
                    products: `id<-$commision_product->commision_node__id::core`,
                },
            },
        }),

        commision_node_tl: table_new_public_data({
            rest: rest_new_data({
                get: {
                    kind: "std",

                    query: rest_getquery_new({
                        pick_source__id: ftype_new({
                            kind: "array",
                            child: ftype_new("uuid", { status_optional: true, }),
                        }, { status_optional: true }),
                    }),
                },
            }),

            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                lang: "text static",
                tltable: "record_text static",
                owner: "?uuid static indexed $acc->id",
                source__id: "uuid static indexed $commision_node->id",
            },
        }),

        commision_node_refimg: table_new_public_data({
            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                owner: "?uuid static indexed $acc->id",

                img__id: "uuid static indexed $img->id",
                commision_node__id: "uuid static indexed $commision_node->id",
            },

            joins: {
                core: {
                    img: "img__id->$img->id::core",
                },
            },
        }),

        commision_product: table_new_public_data({
            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                quantity: "int32",
                price_formula: "formula",
                tmplpr_name: "text static",
                owner: "?uuid static indexed $acc->id",

                tmplpr__id: "?uuid static indexed $tmplpr->id",
                commision_node__id: "uuid static indexed $commision_node->id",
            },

            joins: {
                core: {
                    tl: "id<-$commision_product_tl->source__id::core",
                    refimgs: "id<-$commision_product_refimg->commision_product__id::core",
                    args_line: "id<-$commision_product_argline->commision_product__id::core",
                    args_rect: "id<-$commision_product_argrect->commision_product__id::core",
                    args_bool: "id<-$commision_product_argbool->commision_product__id::core",
                    args_mat: "id<-$commision_product_argmat->commision_product__id::core",
                },
            },
        }),

        commision_product_tl: table_new_public_data({
            rest: rest_new_data({
                get: {
                    kind: "std",

                    query: rest_getquery_new({
                        pick_source__id: ftype_new({
                            kind: "array",
                            child: ftype_new("uuid", { status_optional: true, }),
                        }, { status_optional: true }),
                    }),
                },
            }),

            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                lang: "text static",
                tltable: "record_text static",
                owner: "?uuid static indexed $acc->id",
                source__id: "uuid static indexed $commision_product->id",
            },
        }),

        commision_product_refimg: table_new_public_data({
            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                owner: "?uuid static indexed $acc->id",

                img__id: "uuid static indexed $img->id",
                commision_product__id: "uuid static indexed $commision_product->id",
            },

            joins: {
                core: {
                    img: "img__id->$img->id::core",
                },
            },
        }),

        commision_product_argline: table_new_public_data({
            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                x_value: "int32",
                name: "text static",
                hidden_formula: "formula static",
                owner: "?uuid static indexed $acc->id",

                commision_product__id: "uuid static $commision_product->id",
            },

            joins: {
                core: {
                    tl: "id<-$commision_product_argline_tl->source__id::core",
                },
            },
        }),

        commision_product_argline_tl: table_new_public_data({
            rest: rest_new_data({
                get: {
                    kind: "std",

                    query: rest_getquery_new({
                        pick_source__id: ftype_new({
                            kind: "array",
                            child: ftype_new("uuid", { status_optional: true, }),
                        }, { status_optional: true }),
                    }),
                },
            }),

            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                lang: "text static",
                tltable: "record_text static",
                owner: "?uuid static indexed $acc->id",
                source__id: "uuid static indexed $commision_product_argline->id",
            },
        }),

        commision_product_argrect: table_new_public_data({
            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                x_value: "int32",
                y_value: "int32",
                name: "text static",
                hidden_formula: "formula static",
                owner: "?uuid static indexed $acc->id",

                commision_product__id: "uuid static $commision_product->id",
            },

            joins: {
                core: {
                    tl: "id<-$commision_product_argrect_tl->source__id::core",
                },
            },
        }),

        commision_product_argrect_tl: table_new_public_data({
            rest: rest_new_data({
                get: {
                    kind: "std",

                    query: rest_getquery_new({
                        pick_source__id: ftype_new({
                            kind: "array",
                            child: ftype_new("uuid", { status_optional: true, }),
                        }, { status_optional: true }),
                    }),
                },
            }),

            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                lang: "text static",
                tltable: "record_text static",
                owner: "?uuid static indexed $acc->id",
                source__id: "uuid static indexed $commision_product_argrect->id",
            },
        }),

        commision_product_argbool: table_new_public_data({
            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                value: "bool",
                name: "text static",
                title_true: "text static",
                title_false: "text static",
                hidden_formula: "formula static",
                owner: "?uuid static indexed $acc->id",

                commision_product__id: "uuid static $commision_product->id",
            },

            joins: {
                core: {
                    tl: "id<-$commision_product_argbool_tl->source__id::core",
                },
            },
        }),

        commision_product_argbool_tl: table_new_public_data({
            rest: rest_new_data({
                get: {
                    kind: "std",

                    query: rest_getquery_new({
                        pick_source__id: ftype_new({
                            kind: "array",
                            child: ftype_new("uuid", { status_optional: true, }),
                        }, { status_optional: true }),
                    }),
                },
            }),

            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                lang: "text static",
                tltable: "record_text static",
                owner: "?uuid static indexed $acc->id",
                source__id: "uuid static indexed $commision_product_argbool->id",
            },
        }),

        commision_product_argmat: table_new_public_data({
            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                name: "text static",
                tmplmt_name: "text static",
                hidden_formula: "formula static",
                owner: "?uuid static indexed $acc->id",

                tmplmt__id: "?uuid static $tmplmt->id",
                material__id: "?uuid static $material->id",
                commision_product__id: "uuid static $commision_product->id",
            },

            joins: {
                core: {
                    tl: "id<-$commision_product_argmat_tl->source__id::core",
                    tmplmt: "tmplmt__id?->$tmplmt->id::core",
                    material: "material__id?->$material->id::core",
                    refimgs: "id<-$commision_product_argmat_refimg->commision_product_argmat__id::core",
                },
            },
        }),

        commision_product_argmat_tl: table_new_public_data({
            rest: rest_new_data({
                get: {
                    kind: "std",

                    query: rest_getquery_new({
                        pick_source__id: ftype_new({
                            kind: "array",
                            child: ftype_new("uuid", { status_optional: true, }),
                        }, { status_optional: true }),
                    }),
                },
            }),

            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                lang: "text static",
                tltable: "record_text",
                owner: "?uuid static indexed $acc->id",
                source__id: "uuid static indexed $commision_product_argmat->id",
            },
        }),

        commision_product_argmat_refimg: table_new_public_data({
            fields: {
                id: "uuid static primary",
                deleted: "bool static indexed autogen",
                creation_date: "int64 static indexed autogen",

                owner: "?uuid static indexed $acc->id",

                img__id: "uuid static indexed $img->id",
                commision_product_argmat__id: "uuid static indexed $commision_product_argmat->id",
            },

            joins: {
                core: {
                    img: "img__id->$img->id::core",
                }
            },
        }),
    }
} satisfies DefServer
