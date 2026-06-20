import type { DefClient } from "@src/def/type/client"

export const remdef = {
	ping_device: {
		kind: "data",
		joins: {
			core: {}
		}
	},
	ping_msg: {
		kind: "data",
		joins: {
			core: {}
		}
	},
	acc: {
		kind: "data",
		joins: {
			core: {}
		}
	},
	img: {
		kind: "img",
		joins: {
			core: {}
		}
	},
	delivery_division: {
		kind: "data",
		joins: {
			core: {}
		}
	},
	contact_message: {
		kind: "data",
		joins: {
			core: {}
		}
	},
	acc_authemail: {
		kind: "data",
		joins: {
			core: {}
		}
	},
	tmplit: {
		kind: "data",
		joins: {
			core: {
				tl: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "tmplit_tl",
					target_field: "source__id"
				},
				refimgs: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "tmplit_refimg",
					target_field: "tmplit__id"
				}
			}
		}
	},
	tmplit_tl: {
		kind: "data",
		joins: {
			core: {}
		}
	},
	tmplit_refimg: {
		kind: "data",
		joins: {
			core: {
				img: {
					kind: "forwards",
					status_optional: false,
					variant: "core",
					self_field: "img__id",
					target_table: "img",
					target_field: "id"
				}
			}
		}
	},
	item: {
		kind: "data",
		joins: {
			core: {
				tl: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "item_tl",
					target_field: "source__id"
				},
				variants: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "variant",
					target_field: "item__id"
				},
				template: {
					kind: "forwards",
					status_optional: false,
					variant: "core",
					self_field: "tmplit__id",
					target_table: "tmplit",
					target_field: "id"
				},
				refimgs: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "item_refimg",
					target_field: "item__id"
				},
				reftags: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "item_reftag",
					target_field: "item__id"
				}
			}
		}
	},
	item_tl: {
		kind: "data",
		joins: {
			core: {}
		}
	},
	item_refimg: {
		kind: "data",
		joins: {
			core: {
				img: {
					kind: "forwards",
					status_optional: false,
					variant: "core",
					self_field: "img__id",
					target_table: "img",
					target_field: "id"
				}
			}
		}
	},
	item_tag: {
		kind: "data",
		joins: {
			core: {
				tl: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "item_tag_tl",
					target_field: "source__id"
				}
			}
		}
	},
	item_tag_tl: {
		kind: "data",
		joins: {
			core: {}
		}
	},
	item_reftag: {
		kind: "data",
		joins: {
			core: {
				tag: {
					kind: "forwards",
					status_optional: false,
					variant: "core",
					self_field: "item_tag__id",
					target_table: "item_tag",
					target_field: "id"
				}
			}
		}
	},
	prodset: {
		kind: "data",
		joins: {
			core: {
				products: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "product",
					target_field: "prodset__id"
				}
			}
		}
	},
	variant: {
		kind: "data",
		joins: {
			core: {
				prodset: {
					kind: "forwards",
					status_optional: false,
					variant: "core",
					self_field: "prodset__id",
					target_table: "prodset",
					target_field: "id"
				},
				tl: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "variant_tl",
					target_field: "source__id"
				}
			}
		}
	},
	variant_tl: {
		kind: "data",
		joins: {
			core: {}
		}
	},
	tmplmt: {
		kind: "data",
		joins: {
			core: {
				tl: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "tmplmt_tl",
					target_field: "source__id"
				},
				refimgs: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "tmplmt_refimg",
					target_field: "tmplmt__id"
				}
			}
		}
	},
	tmplmt_tl: {
		kind: "data",
		joins: {
			core: {}
		}
	},
	tmplmt_refimg: {
		kind: "data",
		joins: {
			core: {
				img: {
					kind: "forwards",
					status_optional: false,
					variant: "core",
					self_field: "img__id",
					target_table: "img",
					target_field: "id"
				}
			}
		}
	},
	material: {
		kind: "data",
		joins: {
			core: {
				template: {
					kind: "forwards",
					status_optional: false,
					variant: "core",
					self_field: "tmplmt__id",
					target_table: "tmplmt",
					target_field: "id"
				},
				reftags: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "material_reftag",
					target_field: "material__id"
				},
				refimgs: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "material_refimg",
					target_field: "material__id"
				}
			}
		}
	},
	material_refimg: {
		kind: "data",
		joins: {
			core: {
				img: {
					kind: "forwards",
					status_optional: false,
					variant: "core",
					self_field: "img__id",
					target_table: "img",
					target_field: "id"
				}
			}
		}
	},
	material_tag: {
		kind: "data",
		joins: {
			core: {
				tl: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "material_tag_tl",
					target_field: "source__id"
				}
			}
		}
	},
	material_tag_tl: {
		kind: "data",
		joins: {
			core: {}
		}
	},
	material_reftag: {
		kind: "data",
		joins: {
			core: {
				tag: {
					kind: "forwards",
					status_optional: false,
					variant: "core",
					self_field: "material_tag__id",
					target_table: "material_tag",
					target_field: "id"
				}
			}
		}
	},
	tmplpr: {
		kind: "data",
		joins: {
			core: {
				tl: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "tmplpr_tl",
					target_field: "source__id"
				},
				args: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "tmplpr_arg",
					target_field: "tmplpr__id"
				},
				refimgs: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "tmplpr_refimg",
					target_field: "tmplpr__id"
				}
			}
		}
	},
	tmplpr_tl: {
		kind: "data",
		joins: {
			core: {}
		}
	},
	tmplpr_refimg: {
		kind: "data",
		joins: {
			core: {
				img: {
					kind: "forwards",
					status_optional: false,
					variant: "core",
					self_field: "img__id",
					target_table: "img",
					target_field: "id"
				}
			}
		}
	},
	tmplpr_arg: {
		kind: "data",
		joins: {
			core: {
				tl: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "tmplpr_arg_tl",
					target_field: "source__id"
				},
				defs_mat: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "tmplpr_arg_mat",
					target_field: "tmplpr_arg__id"
				},
				defs_line: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "tmplpr_arg_line",
					target_field: "tmplpr_arg__id"
				},
				defs_rect: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "tmplpr_arg_rect",
					target_field: "tmplpr_arg__id"
				},
				defs_bool: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "tmplpr_arg_bool",
					target_field: "tmplpr_arg__id"
				}
			}
		}
	},
	tmplpr_arg_tl: {
		kind: "data",
		joins: {
			core: {}
		}
	},
	tmplpr_arg_line: {
		kind: "data",
		joins: {
			core: {
				marks: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "tmplpr_arg_line_mark",
					target_field: "tmplpr_arg_line__id"
				}
			}
		}
	},
	tmplpr_arg_line_mark: {
		kind: "data",
		joins: {
			core: {
				tl: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "tmplpr_arg_line_mark_tl",
					target_field: "source__id"
				}
			}
		}
	},
	tmplpr_arg_line_mark_tl: {
		kind: "data",
		joins: {
			core: {}
		}
	},
	tmplpr_arg_rect: {
		kind: "data",
		joins: {
			core: {
				marks: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "tmplpr_arg_rect_mark",
					target_field: "tmplpr_arg_rect__id"
				}
			}
		}
	},
	tmplpr_arg_rect_mark: {
		kind: "data",
		joins: {
			core: {
				tl: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "tmplpr_arg_rect_mark_tl",
					target_field: "source__id"
				}
			}
		}
	},
	tmplpr_arg_rect_mark_tl: {
		kind: "data",
		joins: {
			core: {}
		}
	},
	tmplpr_arg_bool: {
		kind: "data",
		joins: {
			core: {
				tl: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "tmplpr_arg_bool_tl",
					target_field: "source__id"
				}
			}
		}
	},
	tmplpr_arg_bool_tl: {
		kind: "data",
		joins: {
			core: {}
		}
	},
	tmplpr_arg_mat: {
		kind: "data",
		joins: {
			core: {
				perms: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "tmplpr_arg_mat_perm",
					target_field: "tmplpr_arg_mat__id"
				}
			}
		}
	},
	tmplpr_arg_mat_perm: {
		kind: "data",
		joins: {
			core: {
				template: {
					kind: "forwards",
					status_optional: false,
					variant: "core",
					self_field: "tmplmt__id",
					target_table: "tmplmt",
					target_field: "id"
				}
			}
		}
	},
	product: {
		kind: "data",
		joins: {
			core: {
				template: {
					kind: "forwards",
					status_optional: false,
					variant: "core",
					self_field: "tmplpr__id",
					target_table: "tmplpr",
					target_field: "id"
				},
				argimps_line: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "product_argline",
					target_field: "product__id"
				},
				argimps_rect: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "product_argrect",
					target_field: "product__id"
				},
				argimps_mat: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "product_argmat",
					target_field: "product__id"
				},
				argimps_bool: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "product_argbool",
					target_field: "product__id"
				}
			}
		}
	},
	product_argline: {
		kind: "data",
		joins: {
			core: {}
		}
	},
	product_argrect: {
		kind: "data",
		joins: {
			core: {}
		}
	},
	product_argmat: {
		kind: "data",
		joins: {
			core: {
				value: {
					kind: "forwards",
					status_optional: true,
					variant: "core",
					self_field: "value",
					target_table: "material",
					target_field: "id"
				}
			}
		}
	},
	product_argbool: {
		kind: "data",
		joins: {
			core: {}
		}
	},
	cart_refnode: {
		kind: "data",
		joins: {
			core: {
				node: {
					kind: "forwards",
					status_optional: false,
					variant: "core",
					self_field: "commision_node__id",
					target_table: "commision_node",
					target_field: "id"
				}
			}
		}
	},
	commision: {
		kind: "data",
		joins: {
			core: {
				refnodes: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "commision_refnode",
					target_field: "commision__id"
				},
				delivery_division: {
					kind: "forwards",
					status_optional: true,
					variant: "core",
					self_field: "delivery_division__id",
					target_table: "delivery_division",
					target_field: "id"
				}
			}
		}
	},
	commision_refnode: {
		kind: "data",
		joins: {
			core: {
				node: {
					kind: "forwards",
					status_optional: false,
					variant: "core",
					self_field: "commision_node__id",
					target_table: "commision_node",
					target_field: "id"
				}
			}
		}
	},
	commision_node: {
		kind: "data",
		joins: {
			core: {
				tl: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "commision_node_tl",
					target_field: "source__id"
				},
				refimgs: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "commision_node_refimg",
					target_field: "commision_node__id"
				},
				products: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "commision_product",
					target_field: "commision_node__id"
				}
			}
		}
	},
	commision_node_tl: {
		kind: "data",
		joins: {
			core: {}
		}
	},
	commision_node_refimg: {
		kind: "data",
		joins: {
			core: {
				img: {
					kind: "forwards",
					status_optional: false,
					variant: "core",
					self_field: "img__id",
					target_table: "img",
					target_field: "id"
				}
			}
		}
	},
	commision_product: {
		kind: "data",
		joins: {
			core: {
				tl: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "commision_product_tl",
					target_field: "source__id"
				},
				refimgs: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "commision_product_refimg",
					target_field: "commision_product__id"
				},
				args_line: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "commision_product_argline",
					target_field: "commision_product__id"
				},
				args_rect: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "commision_product_argrect",
					target_field: "commision_product__id"
				},
				args_bool: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "commision_product_argbool",
					target_field: "commision_product__id"
				},
				args_mat: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "commision_product_argmat",
					target_field: "commision_product__id"
				}
			}
		}
	},
	commision_product_tl: {
		kind: "data",
		joins: {
			core: {}
		}
	},
	commision_product_refimg: {
		kind: "data",
		joins: {
			core: {
				img: {
					kind: "forwards",
					status_optional: false,
					variant: "core",
					self_field: "img__id",
					target_table: "img",
					target_field: "id"
				}
			}
		}
	},
	commision_product_argline: {
		kind: "data",
		joins: {
			core: {
				tl: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "commision_product_argline_tl",
					target_field: "source__id"
				}
			}
		}
	},
	commision_product_argline_tl: {
		kind: "data",
		joins: {
			core: {}
		}
	},
	commision_product_argrect: {
		kind: "data",
		joins: {
			core: {
				tl: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "commision_product_argrect_tl",
					target_field: "source__id"
				}
			}
		}
	},
	commision_product_argrect_tl: {
		kind: "data",
		joins: {
			core: {}
		}
	},
	commision_product_argbool: {
		kind: "data",
		joins: {
			core: {
				tl: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "commision_product_argbool_tl",
					target_field: "source__id"
				}
			}
		}
	},
	commision_product_argbool_tl: {
		kind: "data",
		joins: {
			core: {}
		}
	},
	commision_product_argmat: {
		kind: "data",
		joins: {
			core: {
				tl: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "commision_product_argmat_tl",
					target_field: "source__id"
				},
				tmplmt: {
					kind: "forwards",
					status_optional: true,
					variant: "core",
					self_field: "tmplmt__id",
					target_table: "tmplmt",
					target_field: "id"
				},
				material: {
					kind: "forwards",
					status_optional: true,
					variant: "core",
					self_field: "material__id",
					target_table: "material",
					target_field: "id"
				},
				refimgs: {
					kind: "backwards",
					status_optional: false,
					variant: "core",
					self_field: "id",
					target_table: "commision_product_argmat_refimg",
					target_field: "commision_product_argmat__id"
				}
			}
		}
	},
	commision_product_argmat_tl: {
		kind: "data",
		joins: {
			core: {}
		}
	},
	commision_product_argmat_refimg: {
		kind: "data",
		joins: {
			core: {
				img: {
					kind: "forwards",
					status_optional: false,
					variant: "core",
					self_field: "img__id",
					target_table: "img",
					target_field: "id"
				}
			}
		}
	}
} satisfies DefClient