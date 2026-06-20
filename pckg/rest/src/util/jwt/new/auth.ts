import jwt from "jsonwebtoken"

export function jwt_new_auth(id: string, secret: string, duration: number): string {
    return jwt.sign({ id }, secret, { expiresIn: duration })
}
