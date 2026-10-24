export const webc_url = process.env.WEBC_URL!
export const webc_port = Number.parseInt(process.env.WEBC_PORT ?? "NaN")

export const webp_url = process.env.WEBP_URL!
export const webp_port = Number.parseInt(process.env.WEBP_PORT ?? "NaN")

export const api_url = process.env.API_URL!
export const api_port = Number.parseInt(process.env.API_PORT ?? "NaN")

if (typeof webc_url !== "string") {
    throw new Error(`WEBC_URL env is not defined`)
}

if (!Number.isFinite(webc_port)) {
    throw new Error(`WEBC_POST env is not defined`)
}

if (typeof webp_url !== "string") {
    throw new Error(`WEBP_URL env is not defined`)
}

if (!Number.isFinite(webp_port)) {
    throw new Error(`WEBP_POST env is not defined`)
}

if (typeof api_url !== "string") {
    throw new Error(`API_URL env is not defined`)
}

if (!Number.isFinite(api_port)) {
    throw new Error(`API_POST env is not defined`)
}
