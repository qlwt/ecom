export const schedule_cleanup = function() {
    const cb = async function() {
        console.log("runworker:cleanup")

        try {
            await new Promise<void>((resolve, reject) => {
                const worker = new Worker(new URL("./job/cleanup", import.meta.url), {
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

        console.log("endworker:cleanup")

        {
            const delay = 24 * 60 * 60 * 1e3

            console.log(
                `${new Date().toUTCString()} Finished cron cleanup\n`
                + `Next cleanup is scheduled\n`
                + `Next cleanup on: ${new Date(Date.now() + delay).toUTCString()}, which is ${delay / 3600 / 1e3} hours from now`
            )

            // schedule the next day
            setTimeout(cb, delay)
        }
    }

    cb()
}
