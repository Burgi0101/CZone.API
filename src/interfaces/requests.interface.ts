import { Request } from "express";
import UserDto from "../controllers/authentication/auth.dto";

export interface IAuthenticatedRequest extends Request {
    user: UserDto;
}
