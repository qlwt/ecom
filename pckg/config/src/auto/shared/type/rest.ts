import * as cst from "@fst/cst"
import * as sxs from "@fst/syntax-search"

export type RestData = {
	ping_device: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
				pick_token: (string)[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					token: string,
				},
				joins: {
				},
			})[],
		},
	},
	ping_msg: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
					phone?: string,
					status_checked?: 0 | 1,
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					phone: string,
					owner: string,
					cmethod: cst.PingMe_ContactMethod,
				},
				joins: {
				},
			})[],
		},
	},
	acc: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
					contact_email?: string,
					contact_phone?: string,
					contact_fname?: string,
					contact_lname?: string,
					contact_pname?: string,
					delivery_division__id?: string | null,
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					contact_email: string,
					contact_phone: string,
					contact_fname: string,
					contact_lname: string,
					contact_pname: string,
					delivery_division__id: string | null,
				},
				joins: {
				},
			})[],
		},
	},
	delivery_division: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
				pick_cities: (number)[] | null,
				pick_parents: (number)[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					address: string,
					address_city: string,
					address_region: string,
					address_postcode: string,
					address_building: string,
					name_full: string,
					name_short: string,
					owner: string,
					source: string,
					category: string,
					latitude: number,
					longitude: number,
					numid: number,
					externalid: string,
					status_text: string,
					status_available: 0 | 1,
					parent_name: string,
					parent_numid: number,
					city_name: string,
					city_numid: number,
					country_code: string,
				},
				joins: {
				},
			})[],
		},
	},
	contact_message: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
				search: sxs.Schema | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
					topic?: string,
					content?: string,
					email?: string,
					status_reviewed?: 0 | 1,
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					topic: string,
					content: string,
					email: string,
					owner: string | null,
				},
				joins: {
				},
			})[],
		},
	},
	acc_authemail: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					email: string,
					owner: string,
				},
				joins: {
				},
			})[],
		},
	},
	tmplit: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
				search: sxs.Schema | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
					name?: string,
					status_hidden?: 0 | 1,
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					name: string,
					status_hidden: 0 | 1,
				},
				joins: {
					tl?: Rest["tmplit_tl"]["post"]["body"] | null,
					refimgs?: Rest["tmplit_refimg"]["post"]["body"] | null,
				},
			})[],
		},
	},
	tmplit_tl: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
				pick_source__id: (string | null)[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
					tltable?: Record<string, string>,
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					lang: string,
					tltable: Record<string, string>,
					source__id: string,
				},
				joins: {
				},
			})[],
		},
	},
	tmplit_refimg: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					img__id: string,
					tmplit__id: string,
				},
				joins: {
				},
			})[],
		},
	},
	item: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
				pick_tmplit__id: (string)[] | null,
				filter_tag__id: (string)[] | null,
				search: sxs.Schema | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
					name?: string,
					status_hidden?: 0 | 1,
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					name: string,
					status_hidden: 0 | 1,
					tmplit__id: string,
				},
				joins: {
					tl?: Rest["item_tl"]["post"]["body"] | null,
					variants?: Rest["variant"]["post"]["body"] | null,
					template?: Rest["tmplit"]["post"]["body"][number] | null,
					refimgs?: Rest["item_refimg"]["post"]["body"] | null,
					reftags?: Rest["item_reftag"]["post"]["body"] | null,
				},
			})[],
		},
	},
	item_tl: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
				pick_source__id: (string | null)[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
					tltable?: Record<string, string>,
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					lang: string,
					tltable: Record<string, string>,
					source__id: string,
				},
				joins: {
				},
			})[],
		},
	},
	item_refimg: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					img__id: string,
					item__id: string,
				},
				joins: {
				},
			})[],
		},
	},
	item_tag: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
				filter_tmplit__id: (string)[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
					name?: string,
					status_hidden?: 0 | 1,
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					name: string,
					status_hidden: 0 | 1,
				},
				joins: {
					tl?: Rest["item_tag_tl"]["post"]["body"] | null,
				},
			})[],
		},
	},
	item_tag_tl: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
				pick_source__id: (string | null)[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
					tltable?: Record<string, string>,
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					lang: string,
					tltable: Record<string, string>,
					source__id: string,
				},
				joins: {
				},
			})[],
		},
	},
	item_reftag: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					item__id: string,
					item_tag__id: string,
				},
				joins: {
					tag?: Rest["item_tag"]["post"]["body"][number] | null,
				},
			})[],
		},
	},
	prodset: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					owner: string | null,
				},
				joins: {
					products?: Rest["product"]["post"]["body"] | null,
				},
			})[],
		},
	},
	variant: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
				pick_item__id: (string)[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
					header?: string,
					description?: string,
					status_hidden?: 0 | 1,
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					header: string,
					description: string,
					status_hidden: 0 | 1,
					owner: string | null,
					prodset__id: string,
					item__id: string,
				},
				joins: {
					prodset?: Rest["prodset"]["post"]["body"][number] | null,
					tl?: Rest["variant_tl"]["post"]["body"] | null,
				},
			})[],
		},
	},
	variant_tl: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
				pick_source__id: (string | null)[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
					tltable?: Record<string, string>,
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					lang: string,
					tltable: Record<string, string>,
					owner: string | null,
					source__id: string,
				},
				joins: {
				},
			})[],
		},
	},
	tmplmt: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
				search: sxs.Schema | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
					name?: string,
					status_hidden?: 0 | 1,
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					name: string,
					status_hidden: 0 | 1,
				},
				joins: {
					tl?: Rest["tmplmt_tl"]["post"]["body"] | null,
					refimgs?: Rest["tmplmt_refimg"]["post"]["body"] | null,
				},
			})[],
		},
	},
	tmplmt_tl: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
				pick_source__id: (string | null)[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
					tltable?: Record<string, string>,
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					lang: string,
					tltable: Record<string, string>,
					source__id: string,
				},
				joins: {
				},
			})[],
		},
	},
	tmplmt_refimg: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					img__id: string,
					tmplmt__id: string,
				},
				joins: {
				},
			})[],
		},
	},
	material: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
				search: sxs.Schema | null,
				pick_tmplmt__id: (string)[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
					status_hidden?: 0 | 1,
					status_available?: 0 | 1,
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					status_hidden: 0 | 1,
					status_available: 0 | 1,
					tmplmt__id: string,
				},
				joins: {
					template?: Rest["tmplmt"]["post"]["body"][number] | null,
					reftags?: Rest["material_reftag"]["post"]["body"] | null,
					refimgs?: Rest["material_refimg"]["post"]["body"] | null,
				},
			})[],
		},
	},
	material_refimg: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					img__id: string,
					material__id: string,
				},
				joins: {
				},
			})[],
		},
	},
	material_tag: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
				filter_tmplmt__id: (string)[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
					name?: string,
					status_hidden?: 0 | 1,
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					name: string,
					status_hidden: 0 | 1,
				},
				joins: {
					tl?: Rest["material_tag_tl"]["post"]["body"] | null,
				},
			})[],
		},
	},
	material_tag_tl: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
				pick_source__id: (string | null)[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
					tltable?: Record<string, string>,
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					lang: string,
					tltable: Record<string, string>,
					source__id: string,
				},
				joins: {
				},
			})[],
		},
	},
	material_reftag: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					material__id: string,
					material_tag__id: string,
				},
				joins: {
					tag?: Rest["material_tag"]["post"]["body"][number] | null,
				},
			})[],
		},
	},
	tmplpr: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
				search: sxs.Schema | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
					status_hidden?: 0 | 1,
					price_formula?: string,
					name?: string,
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					status_hidden: 0 | 1,
					price_formula: string,
					name: string,
				},
				joins: {
					tl?: Rest["tmplpr_tl"]["post"]["body"] | null,
					args?: Rest["tmplpr_arg"]["post"]["body"] | null,
					refimgs?: Rest["tmplpr_refimg"]["post"]["body"] | null,
				},
			})[],
		},
	},
	tmplpr_tl: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
				pick_source__id: (string | null)[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
					tltable?: Record<string, string>,
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					lang: string,
					tltable: Record<string, string>,
					source__id: string,
				},
				joins: {
				},
			})[],
		},
	},
	tmplpr_refimg: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					img__id: string,
					tmplpr__id: string,
				},
				joins: {
				},
			})[],
		},
	},
	tmplpr_arg: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
					name?: string,
					hidden_formula?: string,
					kind?: cst.TmplPrArg_Kind,
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					name: string,
					hidden_formula: string,
					tmplpr__id: string,
					kind: cst.TmplPrArg_Kind,
				},
				joins: {
					tl?: Rest["tmplpr_arg_tl"]["post"]["body"] | null,
					defs_mat?: Rest["tmplpr_arg_mat"]["post"]["body"] | null,
					defs_line?: Rest["tmplpr_arg_line"]["post"]["body"] | null,
					defs_rect?: Rest["tmplpr_arg_rect"]["post"]["body"] | null,
					defs_bool?: Rest["tmplpr_arg_bool"]["post"]["body"] | null,
				},
			})[],
		},
	},
	tmplpr_arg_tl: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
				pick_source__id: (string | null)[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
					tltable?: Record<string, string>,
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					lang: string,
					tltable: Record<string, string>,
					source__id: string,
				},
				joins: {
				},
			})[],
		},
	},
	tmplpr_arg_line: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
					x_value_def?: number,
					x_bound_min?: number,
					x_bound_max?: number,
					x_value_step?: number,
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					x_value_def: number,
					x_bound_min: number,
					x_bound_max: number,
					x_value_step: number,
					tmplpr_arg__id: string,
				},
				joins: {
					marks?: Rest["tmplpr_arg_line_mark"]["post"]["body"] | null,
				},
			})[],
		},
	},
	tmplpr_arg_line_mark: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
					x_value?: number,
					label?: string,
					tmplpr_arg_line__id?: string,
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					x_value: number,
					label: string,
					tmplpr_arg_line__id: string,
				},
				joins: {
					tl?: Rest["tmplpr_arg_line_mark_tl"]["post"]["body"] | null,
				},
			})[],
		},
	},
	tmplpr_arg_line_mark_tl: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
				pick_source__id: (string | null)[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
					tltable?: Record<string, string>,
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					lang: string,
					tltable: Record<string, string>,
					source__id: string,
				},
				joins: {
				},
			})[],
		},
	},
	tmplpr_arg_rect: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
					x_value_def?: number,
					x_bound_min?: number,
					x_bound_max?: number,
					x_value_step?: number,
					y_value_def?: number,
					y_bound_min?: number,
					y_bound_max?: number,
					y_value_step?: number,
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					x_value_def: number,
					x_bound_min: number,
					x_bound_max: number,
					x_value_step: number,
					y_value_def: number,
					y_bound_min: number,
					y_bound_max: number,
					y_value_step: number,
					tmplpr_arg__id: string,
				},
				joins: {
					marks?: Rest["tmplpr_arg_rect_mark"]["post"]["body"] | null,
				},
			})[],
		},
	},
	tmplpr_arg_rect_mark: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
					x_value?: number,
					y_value?: number,
					label?: string,
					tmplpr_arg_rect__id?: string,
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					x_value: number,
					y_value: number,
					label: string,
					tmplpr_arg_rect__id: string,
				},
				joins: {
					tl?: Rest["tmplpr_arg_rect_mark_tl"]["post"]["body"] | null,
				},
			})[],
		},
	},
	tmplpr_arg_rect_mark_tl: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
				pick_source__id: (string | null)[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
					tltable?: Record<string, string>,
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					lang: string,
					tltable: Record<string, string>,
					source__id: string,
				},
				joins: {
				},
			})[],
		},
	},
	tmplpr_arg_bool: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
					value_def?: 0 | 1,
					title_true?: string,
					title_false?: string,
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					value_def: 0 | 1,
					title_true: string,
					title_false: string,
					tmplpr_arg__id: string,
				},
				joins: {
					tl?: Rest["tmplpr_arg_bool_tl"]["post"]["body"] | null,
				},
			})[],
		},
	},
	tmplpr_arg_bool_tl: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
				pick_source__id: (string | null)[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
					tltable?: Record<string, string>,
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					lang: string,
					tltable: Record<string, string>,
					source__id: string,
				},
				joins: {
				},
			})[],
		},
	},
	tmplpr_arg_mat: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					tmplpr_arg__id: string,
				},
				joins: {
					perms?: Rest["tmplpr_arg_mat_perm"]["post"]["body"] | null,
				},
			})[],
		},
	},
	tmplpr_arg_mat_perm: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					tmplmt__id: string | null,
					tmplpr_arg_mat__id: string,
				},
				joins: {
					template?: Rest["tmplmt"]["post"]["body"][number] | null,
				},
			})[],
		},
	},
	product: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
				pick_tmplpr__id: (string)[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
					quantity?: number,
					tmplpr__id?: string,
					prodset__id?: string,
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					quantity: number,
					owner: string | null,
					tmplpr__id: string,
					prodset__id: string,
				},
				joins: {
					template?: Rest["tmplpr"]["post"]["body"][number] | null,
					argimps_line?: Rest["product_argline"]["post"]["body"] | null,
					argimps_rect?: Rest["product_argrect"]["post"]["body"] | null,
					argimps_mat?: Rest["product_argmat"]["post"]["body"] | null,
					argimps_bool?: Rest["product_argbool"]["post"]["body"] | null,
				},
			})[],
		},
	},
	product_argline: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
					x_value?: number,
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					x_value: number,
					owner: string | null,
					product__id: string,
					tmplpr_arg_line__id: string,
				},
				joins: {
				},
			})[],
		},
	},
	product_argrect: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
					x_value?: number,
					y_value?: number,
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					x_value: number,
					y_value: number,
					owner: string | null,
					product__id: string,
					tmplpr_arg_rect__id: string,
				},
				joins: {
				},
			})[],
		},
	},
	product_argmat: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
					value?: string | null,
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					value: string | null,
					owner: string | null,
					product__id: string,
					tmplpr_arg_mat__id: string,
				},
				joins: {
					value?: Rest["material"]["post"]["body"][number] | null,
				},
			})[],
		},
	},
	product_argbool: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
					value?: 0 | 1,
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					value: 0 | 1,
					owner: string | null,
					product__id: string,
					tmplpr_arg_bool__id: string,
				},
				joins: {
				},
			})[],
		},
	},
	cart_refnode: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
					quantity?: number,
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					quantity: number,
					owner: string,
					commision_node__id: string,
				},
				joins: {
					node?: Rest["commision_node"]["post"]["body"][number] | null,
				},
			})[],
		},
	},
	commision: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
				search: sxs.Schema | null,
				id_public: string | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
					status_static?: 0 | 1,
					paynment_amount?: number,
					status_delivered?: 0 | 1,
					contact_email?: string,
					contact_phone?: string,
					contact_fname?: string,
					contact_lname?: string,
					contact_pname?: string,
					delivery_division__id?: string | null,
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					id_public: string,
					owner: string | null,
					status_static: 0 | 1,
					contact_email: string,
					contact_phone: string,
					contact_fname: string,
					contact_lname: string,
					contact_pname: string,
					delivery_division__id: string | null,
				},
				joins: {
					refnodes?: Rest["commision_refnode"]["post"]["body"] | null,
					delivery_division?: Rest["delivery_division"]["post"]["body"][number] | null,
				},
			})[],
		},
	},
	commision_refnode: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
					quantity?: number,
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					quantity: number,
					owner: string | null,
					commision__id: string,
					commision_node__id: string,
				},
				joins: {
					node?: Rest["commision_node"]["post"]["body"][number] | null,
				},
			})[],
		},
	},
	commision_node: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					item_name: string,
					tmplit_name: string,
					variant_header: string,
					owner: string | null,
					item__id: string | null,
					tmplit__id: string | null,
					variant__id: string | null,
				},
				joins: {
					tl?: Rest["commision_node_tl"]["post"]["body"] | null,
					refimgs?: Rest["commision_node_refimg"]["post"]["body"] | null,
					products?: Rest["commision_product"]["post"]["body"] | null,
				},
			})[],
		},
	},
	commision_node_tl: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
				pick_source__id: (string | null)[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					lang: string,
					tltable: Record<string, string>,
					owner: string | null,
					source__id: string,
				},
				joins: {
				},
			})[],
		},
	},
	commision_node_refimg: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					owner: string | null,
					img__id: string,
					commision_node__id: string,
				},
				joins: {
				},
			})[],
		},
	},
	commision_product: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
					quantity?: number,
					price_formula?: string,
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					quantity: number,
					price_formula: string,
					tmplpr_name: string,
					owner: string | null,
					tmplpr__id: string | null,
					commision_node__id: string,
				},
				joins: {
					tl?: Rest["commision_product_tl"]["post"]["body"] | null,
					refimgs?: Rest["commision_product_refimg"]["post"]["body"] | null,
					args_line?: Rest["commision_product_argline"]["post"]["body"] | null,
					args_rect?: Rest["commision_product_argrect"]["post"]["body"] | null,
					args_bool?: Rest["commision_product_argbool"]["post"]["body"] | null,
					args_mat?: Rest["commision_product_argmat"]["post"]["body"] | null,
				},
			})[],
		},
	},
	commision_product_tl: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
				pick_source__id: (string | null)[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					lang: string,
					tltable: Record<string, string>,
					owner: string | null,
					source__id: string,
				},
				joins: {
				},
			})[],
		},
	},
	commision_product_refimg: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					owner: string | null,
					img__id: string,
					commision_product__id: string,
				},
				joins: {
				},
			})[],
		},
	},
	commision_product_argline: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
					x_value?: number,
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					x_value: number,
					name: string,
					hidden_formula: string,
					owner: string | null,
					commision_product__id: string,
				},
				joins: {
					tl?: Rest["commision_product_argline_tl"]["post"]["body"] | null,
				},
			})[],
		},
	},
	commision_product_argline_tl: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
				pick_source__id: (string | null)[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					lang: string,
					tltable: Record<string, string>,
					owner: string | null,
					source__id: string,
				},
				joins: {
				},
			})[],
		},
	},
	commision_product_argrect: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
					x_value?: number,
					y_value?: number,
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					x_value: number,
					y_value: number,
					name: string,
					hidden_formula: string,
					owner: string | null,
					commision_product__id: string,
				},
				joins: {
					tl?: Rest["commision_product_argrect_tl"]["post"]["body"] | null,
				},
			})[],
		},
	},
	commision_product_argrect_tl: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
				pick_source__id: (string | null)[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					lang: string,
					tltable: Record<string, string>,
					owner: string | null,
					source__id: string,
				},
				joins: {
				},
			})[],
		},
	},
	commision_product_argbool: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
					value?: 0 | 1,
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					value: 0 | 1,
					name: string,
					title_true: string,
					title_false: string,
					hidden_formula: string,
					owner: string | null,
					commision_product__id: string,
				},
				joins: {
					tl?: Rest["commision_product_argbool_tl"]["post"]["body"] | null,
				},
			})[],
		},
	},
	commision_product_argbool_tl: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
				pick_source__id: (string | null)[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					lang: string,
					tltable: Record<string, string>,
					owner: string | null,
					source__id: string,
				},
				joins: {
				},
			})[],
		},
	},
	commision_product_argmat: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					name: string,
					tmplmt_name: string,
					hidden_formula: string,
					owner: string | null,
					tmplmt__id: string | null,
					material__id: string | null,
					commision_product__id: string,
				},
				joins: {
					tl?: Rest["commision_product_argmat_tl"]["post"]["body"] | null,
					tmplmt?: Rest["tmplmt"]["post"]["body"][number] | null,
					material?: Rest["material"]["post"]["body"][number] | null,
					refimgs?: Rest["commision_product_argmat_refimg"]["post"]["body"] | null,
				},
			})[],
		},
	},
	commision_product_argmat_tl: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
				pick_source__id: (string | null)[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
					tltable?: Record<string, string>,
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					lang: string,
					tltable: Record<string, string>,
					owner: string | null,
					source__id: string,
				},
				joins: {
				},
			})[],
		},
	},
	commision_product_argmat_refimg: {
		get: {
			query: {
				limit: number | null,
				cursor: string | null,
				include_hidden: 0 | 1 | null,
				pick_owner: ((string | ("null-public" | "null-private")))[] | null,
			},
		},
		patch: {
			body: {
				id: string,
				patch: {
				},
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: ({
				core: {
					id: string,
					owner: string | null,
					img__id: string,
					commision_product_argmat__id: string,
				},
				joins: {
				},
			})[],
		},
	},
}

export type RestImg = {
	img: {
		get: {
			query: {
				id: string,
				area: number,
			},
		},
		delete: {
			body: {
				ids: (string)[],
			},
		},
		post: {
			body: {
				id: string,
			},
			files: {
				img: [File],
			},
		},
	},
}

export type Rest = (RestData & RestImg)