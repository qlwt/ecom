import { dbact_delivery_update } from "@src/util/dbact/delivery/update"

const job = async function() {
    await dbact_delivery_update()

    self.postMessage(0)
}

job()
