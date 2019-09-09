export class HttpException extends Error {
    status: number;
    message: string;
    errors: object;

    constructor(status: number, message: string, errors: object) {
        super(message);
        this.status = status;
        this.errors = errors;
    }
}

export class CORSException extends HttpException {
    constructor() {
        super(401, `Not allowed by CORS`, {});
    }
}
