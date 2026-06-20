import "dotenv"

export const env_port = Number.parseInt(process.env.PORT || "NaN")

export const env_client_host = process.env.CLIENT_HOST!
export const env_console_host = process.env.CONSOLE_HOST!

export const env_db_name = process.env.DB_NAME!
export const env_db_host = process.env.DB_HOST!
export const env_db_user = process.env.DB_USER!
export const env_db_password = process.env.DB_PASSWORD!
export const env_db_port = Number.parseInt(process.env.DB_PORT || "NaN")

export const env_cookie_secret = process.env.COOKIE_SECRET!

export const env_jwta_secret = process.env.JWTA_SECRET!
export const env_jwtr_secret = process.env.JWTR_SECRET!

export const env_firebase_admin_cred = process.env.FIREBASE_ADMIN_CRED!

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

if (typeof env_cookie_secret !== "string") {
    throw new Error("env.COOKIE_SECRET is undefined")
}

if (typeof env_jwta_secret !== "string") {
    throw new Error("env.JWTA_SECRET is undefined")
}

if (typeof env_jwtr_secret !== "string") {
    throw new Error("env.JWTR_SECRET is undefined")
}

if (typeof env_client_host !== "string") {
    throw new Error("env.CLIENT_HOST is undefined")
}

if (typeof env_console_host !== "string") {
    throw new Error("env.CONSOLE_HOST is undefined")
}

if (typeof env_firebase_admin_cred !== "string") {
    throw new Error("env.FIREBASE_ADMIN_CRED is undefined")
}
