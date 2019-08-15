import { Request } from "express";

import { IUser } from "../controllers/authentication/auth.interfaces";

export interface IAuthenticatedRequest extends Request {
    user: IUser;
}
