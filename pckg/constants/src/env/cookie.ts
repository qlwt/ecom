export const cookie_secret = process.env.COOKIE_SECRET!

if (typeof cookie_secret !== "string") {
    throw new Error(`COOKIE_SECRET env is not defined`)
}
