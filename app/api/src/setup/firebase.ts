import { env_firebase_admin_cred } from "@/src/env"
import frba from "firebase-admin"

export const setup_firebase = async function() {
    if (env_firebase_admin_cred !== "disabled") {
        frba.initializeApp({
            credential: frba.credential.cert(JSON.parse(env_firebase_admin_cred))
        })
    }
}
