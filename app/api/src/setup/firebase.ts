import frba from "firebase-admin"
import * as env_back from "@fst/cst/env_back"

export const setup_firebase = async function() {
    if (env_back.firebase_cred !== "disabled") {
        frba.initializeApp({
            credential: frba.credential.cert(JSON.parse(env_back.firebase_cred))
        })
    }
}
