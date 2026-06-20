import * as crypto from "node:crypto"

export const auth__hash_new = function (raw: string, salt: string): string {
    return crypto.scryptSync(raw, salt, 64).toString("hex")
}

export const auth__comparator_timesafe = function (left: string, right: string): boolean {
    return crypto.timingSafeEqual(Buffer.from(left, "hex"), Buffer.from(right, "hex"))
}

export const auth__salt_new = function (): string {
    return crypto.randomBytes(32).toString("hex")
}
