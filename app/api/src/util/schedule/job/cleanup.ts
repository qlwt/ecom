import { dbact_cleanup_all } from "@src/util/dbact/cleanup/all"

const job = async function() {
    await dbact_cleanup_all()

    self.postMessage(0)
}

job()
