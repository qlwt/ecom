export const env_apiurl = process.env.API_URL

if (typeof env_apiurl !== "string") {
    throw new Error(`API_URL is not string`)
}
