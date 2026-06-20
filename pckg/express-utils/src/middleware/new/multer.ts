import type { Middleware } from "@src/middleware/type/middleware"
import * as express from "express"
import multer from "multer"
import * as path from "node:path"

export type MulterFile = Express.Multer.File

export type Middleware__NewMulter_FilterContext = {
    readonly file: MulterFile
    readonly req: express.Request
    readonly next: () => void
}

export type Middleware__NewMulter_Filter = {
    (context: Middleware__NewMulter_FilterContext): void
}

export type Middleware__NewMulter_Params = {
    readonly files: multer.Field[]

    readonly limits?: multer.Options["limits"]
    readonly filter?: Middleware__NewMulter_Filter
}

type Params = Middleware__NewMulter_Params

export const middleware_new_multer = function(params: Params): Middleware {
    return multer({
        limits: params.limits,
        dest: path.resolve("./storage/"),

        fileFilter: (req, file, callback) => {
            if (params.filter) {
                try {
                    params.filter({
                        req,
                        file,
                        next: () => {
                            callback(null, true)
                        }
                    })
                } catch (e: any) {
                    callback(e)
                }
            } else {
                callback(null, true)
            }
        },
    }).fields(params.files)
}
