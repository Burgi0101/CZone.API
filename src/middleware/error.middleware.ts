import { NextFunction, Request, Response } from "express";


export class HttpException extends Error {
    status: number;
    message: string;
    errors: object;

    constructor(status: number, message: string, errors: object) {
        super(message);
        this.status = status;
        this.message = message;
        this.errors = errors;
    }
}

function errorHandler(error: HttpException, request: Request, response: Response, next: NextFunction) {
    const status = error.status || 500;
    const message = error.message || "Something went wrong";
    const errors = error.errors || {};

    response
        .status(status)
        .send({
            status,
            message,
            errors
        });
}

export default errorHandler;
