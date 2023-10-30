export class HttpNotFoundError extends Error {
    status: number
    constructor(message: string) {
        super(message)
        this.name = 'HttpNotFoundError'
        this.message = message
        this.status = 404
    }
}
