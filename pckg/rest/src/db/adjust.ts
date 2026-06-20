import * as cst from "@fst/cst"
import { db } from "@src/db/init"
import { env_admin_email, env_admin_password } from "@src/env"
import * as crypto from "node:crypto"
import { v7 as uuid } from "uuid"

export const db_adjust = async function() {
    const acc = await (db
        .selectFrom("acc")
        .where("access", "=", cst.AccountAccess.Admin)
        .innerJoin("acc_authemail", "acc_authemail.owner", "acc.id")
        .select([
            "acc.id as acc_id",
            "acc_authemail.id as auth_id",
            "acc_authemail.email as auth_email",
            "acc_authemail.password_hash as auth_password_hash",
            "acc_authemail.password_salt as auth_password_salt"
        ] as const)
        .executeTakeFirst()
    )

    if (acc) {
        const now_password_hash = crypto.scryptSync(env_admin_password, acc.auth_password_salt, 64).toString("hex")

        if (acc.auth_email !== env_admin_email || acc.auth_password_hash !== now_password_hash) {
            console.log("updating admin account")

            await (db
                .updateTable("acc_authemail")
                .set({
                    email: env_admin_email,
                    password_hash: now_password_hash,
                })
                .where("acc_authemail.id", "=", acc.auth_id)
                .execute()
            )

            console.log("updated admin account")
        }
    } else {
        console.log("creating admin account")

        const creation_date = Date.now()
        const acc_id = uuid()
        const auth_id = uuid()
        const password_salt = crypto.randomBytes(32).toString("hex")
        const password_hash = crypto.scryptSync(env_admin_password, password_salt, 64).toString("hex")

        await (db
            .insertInto("acc")
            .values({
                id: acc_id,
                deleted: 0,
                creation_date,

                status_sessional: 0,
                access: cst.AccountAccess.Admin,

                contact_email: "",
                contact_phone: "",
                contact_fname: "",
                contact_lname: "",
                contact_pname: "",
            })
            .execute()
        )

        await (db
            .insertInto("acc_authemail")
            .values({
                id: auth_id,
                deleted: 0,
                creation_date,

                owner: acc_id,

                email: env_admin_email,

                password_hash: password_hash,
                password_salt: password_salt,
            })
            .execute()
        )

        console.log("created admin account")
    }
}
