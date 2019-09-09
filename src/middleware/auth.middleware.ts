import { NextFunction, Response } from "express";
import * as jwt from "jsonwebtoken";

import { IDataStoredInToken } from "../controllers/authentication/auth.interfaces";
import { IAuthenticatedRequest } from "../interfaces/requests.interface";

import { User } from "../controllers/authentication/auth.model";

import { NotAuthorizedException } from "../controllers/authentication/auth.exceptions";


async function authMiddleware(req: IAuthenticatedRequest, res: Response, next: NextFunction) {
    const authToken = req.headers.authorization;

    if (authToken) {
        const secret = process.env.SECRET;
        try {
            const verificationResponse = jwt.verify(authToken, secret) as IDataStoredInToken;
            const id = verificationResponse._id;

            const user = await User.findById(id);

            if (user) {
                req.user = user;
                next();
            } else {
                next(new NotAuthorizedException(""));
            }
        } catch (error) {
            next(new NotAuthorizedException(""));
        }
    } else {
        next(new NotAuthorizedException(""));
    }
}

export default authMiddleware;
