import { NextFunction, Request, Response } from "express";

import { HttpException } from "../app.exceptions";


export function errorHandler(error: HttpException, request: Request, response: Response, next: NextFunction) {
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
