import * as cs from "@fst/config/server"
import * as cst from "@fst/cst"
import * as eu from "@fst/express-utils"
import type { RestRoutes_Config, RestRoutes_ImgPostResult } from "@src/rest/type/config"
import { access_acc_strict } from "@src/util/access/acc_strict"
import { db } from "@src/db/init"
import { object_new_map } from "@src/util/object/new/map"
import { promise_waitfor } from "@src/util/promise/waitfor"
import { zod_field_rec_post } from "@src/util/zod/field_rec_post"
import { zod_ftype } from "@src/util/zod/ftype"
import { zod_json } from "@src/util/zod/json"
import * as fs from "node:fs/promises"
import * as path from "node:path"
import * as sharp from "sharp"
import { v7 as uuid } from "uuid"
import * as z from "zod"

const mimetype_new = function(ftype: cs.FType): string | null {
    if (ftype.def.kind === "tuple") {
        const head = ftype.def.children[0]

        if (!head || head.def.kind !== "file") {
            return null
        }

        return head.def.mimetype
    }

    if (ftype.def.kind === "array") {
        if (ftype.def.child.def.kind === "file") {
            return ftype.def.child.def.mimetype
        }
    }

    return null
}

export type RestRoutes_RouteNewImgPost_Params = {
    readonly config: RestRoutes_Config
    readonly table: cs.TablePublicImg
    readonly table_name: keyof cs.RestImg
    readonly restdef_post: cs.RestDefImg_PostStd
}

export const rest_route_new_img_post = function(params: RestRoutes_RouteNewImgPost_Params) {
    const schema_body = z.object({
        payload: zod_json().pipe(zod_field_rec_post(params.table.fields))
    })

    const schema_files = z.object(object_new_map(
        params.restdef_post.files,
        field_ftype => {
            return zod_ftype(field_ftype)
        }
    ))

    return {
        schema: {
            body: schema_body,
            fiels: schema_files
        },

        handler: eu.route_new_path<RestRoutes_ImgPostResult>({
            method: "post",
            path: `/rest/${params.table_name}`,

            middleware: [
                eu.middleware_new_cookie(),

                eu.middleware_new_multer({
                    limits: {
                        fields: 255,
                        // 255 bytes, 255 ANCI characters
                        fieldNameSize: 255,
                        // expected relatively small payload, 5kb per field
                        fieldSize: 5 << 10,

                        files: Object.values(params.restdef_post.files).reduce<number>(
                            (acc, ftype) => {
                                return acc + (ftype.def.kind === "tuple" ? ftype.def.children.length : Infinity)
                            },
                            0
                        ),

                        fileSize: Object.values(params.restdef_post.files).reduce<number>(
                            (acc, ftype) => {
                                if (ftype.def.kind === "tuple") {
                                    return Math.max(acc, ...ftype.def.children.map(child => {
                                        if (child.def.kind !== "file") {
                                            throw new Error(`Using ${child.def.kind} as tuple child in files def`)
                                        }

                                        return child.def.size
                                    }))
                                } else if (ftype.def.kind === "array") {
                                    if (ftype.def.child.def.kind === "file") {
                                        return Math.max(acc, ftype.def.child.def.size)
                                    }

                                    throw new Error(`Using ${ftype.def.child.def.kind} as array child in files def`)
                                }

                                throw new Error(`Using ${ftype.def.kind} in files def`)
                            },
                            0
                        ),
                    },

                    files: Object.entries(params.restdef_post.files).map(([field_name, field_ftype]) => {
                        return {
                            name: field_name,
                            maxCount: field_ftype.def.kind === "tuple" ? field_ftype.def.children.length : Infinity,
                        }
                    }),

                    filter: ({ file, next }) => {
                        const ftype = params.restdef_post.files[file.fieldname]

                        if (!ftype) {
                            throw eu.error_new_custom(400, cst.ServerError.BadReq)
                        }

                        const mimetype = mimetype_new(ftype)

                        if (mimetype === null) {
                            throw eu.error_new_custom(500, `No mimetype defined for field ${file.fieldname}`)
                        }

                        if (!file.mimetype.startsWith(mimetype)) {
                            throw eu.error_new_custom(400, cst.ServerError.BadReq)
                        }

                        next()
                    },
                }),
            ],

            handler: async ({ req, res, }) => {
                const creation_date = Date.now()
                schema_body.parse(req.body)
                const body = eu.input_parse_zod(schema_body, req.body).payload
                const files = eu.input_parse_zod(schema_files, req.files)

                const file = await params.config[params.table_name].post.file_new(files as any)
                const node = await params.config[params.table_name].post.node_convert(body as any, { creation_date, })

                if (!await promise_waitfor(params.config[params.table_name].delete?.access_skip?.(body as any))) {
                    const checks = await promise_waitfor(params.config[params.table_name].delete?.access_check?.(body as any))

                    if (checks && checks.length >= 1) {
                        const acc = await access_acc_strict(req, res)
                        const results = await Promise.all(checks.map(check => check(acc)))

                        if (!results.every(n => n)) {
                            throw eu.error_new_custom(403, cst.ServerError.BadAuth)
                        }
                    }
                }

                await db.transaction().execute(async trx => {
                    const image_sharp = sharp.default(file.path)
                    const image_meta = await image_sharp.metadata()
                    const image_area = Math.floor(Math.sqrt(image_meta.height * image_meta.width))

                    const l_templates = new Array<number>()

                    for (const template_area of params.table.areas) {
                        if (template_area < image_area) {
                            l_templates.push(template_area)
                        } else {
                            l_templates.push(image_area)

                            break
                        }
                    }

                    const variant_imgs = await Promise.all(l_templates.map(async template_area => {
                        const name = `${uuid()}_${template_area}`
                        const divider = Math.sqrt(image_area / template_area)

                        const meta = await sharp.default(file.path).resize({
                            fit: "contain",
                            width: Math.max(1, Math.floor(image_meta.width / divider)),
                            height: Math.max(1, Math.floor(image_meta.height / divider)),

                            withoutEnlargement: true,
                        }).webp({
                            quality: 80,
                        }).toFile(path.resolve(`./storage/${name}`))

                        return {
                            meta,

                            filename: name,
                            area: template_area,
                            mimetype: `image/webp`,
                        }
                    }))

                    await (trx
                        .insertInto(params.table_name)
                        .values(node)
                        .execute()
                    )

                    await (trx
                        .insertInto(params.table.table_variant as `${keyof cs.RestImg}_variant`)
                        .values(await Promise.all(variant_imgs.map(variant => {
                            return params.config[params.table_name].post.variant_convert(body as any, {
                                creation_date,
                                area: variant.area,
                                mimetype: variant.mimetype,
                                filename: variant.filename,
                            })
                        })))
                        .execute()
                    )

                    await fs.rm(file.path)

                    return {
                        creation_date
                    }
                })

                return eu.response_new_json({ body: { creation_date, }, })
            },
        })
    }
}
