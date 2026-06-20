import "dotenv"

export const env_cookie_secret = process.env.COOKIE_SECRET

if (typeof env_cookie_secret !== "string") {
    throw new Error(`COOKIE_SECRET is undefined`)
}
