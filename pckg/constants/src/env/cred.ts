export const firebase_cred = process.env.FIREBASE_CRED!
export const admin_email = process.env.ADMIN_EMAIL!
export const admin_password = process.env.ADMIN_PASSWORD!

if (typeof firebase_cred !== "string") {
    throw new Error(`FIREBASE_CRED env is not defined`)
}

if (typeof admin_email !== "string") {
    throw new Error(`ADMIN_EMAIL env is not defined`)
}

if (typeof admin_email !== "string") {
    throw new Error(`ADMIN_PASSWORD env is not defined`)
}
