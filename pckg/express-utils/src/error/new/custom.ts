import { ErrorExpress } from "@src/error/core/ErrorExpress";

export const error_new_custom = function (status: number, message: string): ErrorExpress {
    return new ErrorExpress(status, message)
}
