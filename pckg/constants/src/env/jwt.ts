export const jwta_secret = process.env.JWTA_SECRET!
export const jwta_duration = Number.parseInt(process.env.JWTA_DURATION ?? "NaN")

export const jwtr_secret = process.env.JWTR_SECRET!
export const jwtr_duration = Number.parseInt(process.env.JWTR_DURATION ?? "NaN")

if (typeof jwta_secret !== "string") {
    throw new Error(`JWTA_SECRET env is not defined`)
}

if (!Number.isFinite(jwta_duration)) {
    throw new Error(`JWTA_DURATION env is not defined`)
}

if (typeof jwtr_secret !== "string") {
    throw new Error(`JWTR_SECRET env is not defined`)
}

if (!Number.isFinite(jwtr_duration)) {
    throw new Error(`JWTR_DURATION env is not defined`)
}
