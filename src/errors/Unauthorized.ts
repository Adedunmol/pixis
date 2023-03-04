import { BaseError } from "./Base";
import StatusCode from 'http-status-codes';

export class UnauthorizedError extends BaseError {
    statusCode: number;
    constructor(message: string) {
        super(message)
        this.statusCode = StatusCode.UNAUTHORIZED
    }
}