import { db } from "@fst/rest"

const timestamp_new = async function() {
    const timestamp_row = await (db
        .selectFrom("timestamp_deliveryupdate")
        .selectAll()
        .limit(1)
        .executeTakeFirst()
    )

    if (timestamp_row) {
        // to ms
        return timestamp_row.timestamp_unix * 1e3
    }

    return Date.now()
}

// get the time of today at midnight
const timestamp_midnight_new = function(timestamp: number) {
    const now = new Date(timestamp)

    return Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
    )
}

const TIME_MINUTE = 60 * 1e3
const TIME_HOUR = 60 * TIME_MINUTE
const TIME_DAY = 24 * TIME_HOUR

// delay before repeating the job
// basically next day from now at the time when the last update was commited + 10 minutes
// operating under an assumption, that third party server has updates in specific time of the day
const cron_delay_new = function(timestamp: number) {
    const now = Date.now()
    const timestamp_date = new Date(timestamp)

    const offset = (
        // + 1 day
        + TIME_DAY
        // + 10 minutes
        + 10 * TIME_MINUTE
        // + hour and minute time of the last database update
        + timestamp_date.getUTCHours() * TIME_HOUR
        + timestamp_date.getUTCMinutes() * TIME_MINUTE
    )

    // if update was done more than one day ago - use midnight of today to avoid negative delay
    if (now - timestamp > TIME_DAY + TIME_MINUTE * 10) {
        return (
            + timestamp_midnight_new(now)
            + offset
        ) - now
    } else {
        return (
            + timestamp_midnight_new(timestamp)
            + offset
        ) - now
    }
}

export const schedule_delivery_update = function() {
    const cb = async function() {
        console.log("runworker:delivery_update")

        try {
            await new Promise<void>((resolve, reject) => {
                const worker = new Worker(new URL("./job/delivery_update", import.meta.url), {
                    type: "module",
                })

                worker.addEventListener("error", error => {
                    reject(error)

                    worker.terminate()
                })

                worker.addEventListener("message", () => {
                    resolve()

                    worker.terminate()
                })
            })
        } catch (error) {
            console.error(error)
        }

        console.log("endworker:delivery_update")

        {
            const delay = cron_delay_new(await timestamp_new())

            console.log(
                `${new Date().toUTCString()} Finished cron delivery_update\n`
                + `Next delivery_update is scheduled\n`
                + `Next delivery_update on: ${new Date(Date.now() + delay).toUTCString()}, which is ${delay / 3600 / 1e3} hours from now`
            )

            // schedule the next day after the update + 10 minutes
            setTimeout(cb, delay)
        }
    }

    cb()
}
