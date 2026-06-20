import "dotenv"

export const env_port = Number.parseInt(process.env.PORT || "NaN")

export const env_db_name = process.env.DB_NAME!
export const env_db_host = process.env.DB_HOST!
export const env_db_user = process.env.DB_USER!
export const env_db_password = process.env.DB_PASSWORD!
export const env_db_port = Number.parseInt(process.env.DB_PORT || "NaN")

export const env_jwta_secret = process.env.JWTA_SECRET!
export const env_jwta_duration = Number.parseInt(process.env.JWTA_DURATION || "NaN")
export const env_jwtr_secret = process.env.JWTR_SECRET!
export const env_jwtr_duration = Number.parseInt(process.env.JWTR_DURATION || "NaN")

export const env_admin_email = process.env.ADMIN_EMAIL!
export const env_admin_password = process.env.ADMIN_PASSWORD!

if (Number.isNaN(env_port)) {
    throw new Error("env.PORT is NaN")
}

if (Number.isNaN(env_db_port)) {
    throw new Error("env.DB_PORT is NaN")
}

if (typeof env_db_name !== "string") {
    throw new Error("env.DB_NAME is undefined")
}

if (typeof env_db_host !== "string") {
    throw new Error("env.DB_HOST is undefined")
}

if (typeof env_db_user !== "string") {
    throw new Error("env.DB_USER is undefined")
}

if (typeof env_db_password !== "string") {
    throw new Error("env.DB_PASSWORD is undefined")
}

if (typeof env_jwta_secret !== "string") {
    throw new Error("env.JWTA_SECRET is undefined")
}

if (Number.isNaN(env_jwtr_duration)) {
    throw new Error("env.JWTA_DURATION is NaN")
}

if (typeof env_jwtr_secret !== "string") {
    throw new Error("env.JWTR_SECRET is undefined")
}

if (Number.isNaN(env_jwta_duration)) {
    throw new Error("env.JWTR_DURATION is NaN")
}

if (typeof env_admin_email !== "string") {
    throw new Error("env.ADMIN_EMAIL is undefined")
}

if (typeof env_admin_password !== "string") {
    throw new Error("env.ADMIN_PASSWORD is undefined")
}
