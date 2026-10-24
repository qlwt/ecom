export const db_url = process.env.DB_URL!

if (typeof db_url !== "string") {
    throw new Error(`DB_URL env is not defined`)
}
