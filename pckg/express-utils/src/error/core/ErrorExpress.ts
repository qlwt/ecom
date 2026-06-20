export class ErrorExpress {
    public readonly express_status: number
    public readonly express_message: string

    public constructor(status: number, message: string) {
        this.express_status = status
        this.express_message = message
    }
}
