import type { Middleware } from "@src/middleware/type/middleware";
import type { NextFunction } from "express";

export const middleware_new_merge = function(src: readonly Middleware[]): Middleware {
    return (req, res, next) => {
        let i = 0

        const it_next: NextFunction = async (error) => {
            if (error) {
                next(error)
            }

            if (i < src.length) {
                const src_item = src[i]!

                try {
                    await src_item(req, res, () => {
                        ++i

                        it_next()
                    })
                } catch (error) {
                    next(error)
                }
            } else {
                next()
            }
        }

        it_next()
    }
}
