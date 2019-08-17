import { RequestHandler, Request, Response, NextFunction } from "express";
import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";

import { HttpException } from "../app.exceptions";


function validationMiddleware<T>(type: any, skipMissingProperties = false): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
        validate(plainToClass(type, req.body), { skipMissingProperties })
            .then((errors: ValidationError[]) => {
                if (errors.length > 0) {
                    // const message = errors.map((error: ValidationError) => Object.values(error));
                    const errorObject = errors.reduce((errorMap, error: ValidationError) => {
                        errorMap[error.property] = Object.values(error.constraints);
                        return errorMap;
                    }, {});
                    next(new HttpException(400, "Validation Error", errorObject));
                } else {
                    next();
                }
            });
    };
}

export default validationMiddleware;
