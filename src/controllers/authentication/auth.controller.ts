import { Router, Request, Response, NextFunction } from "express";

import { validationMiddleware } from "../../middleware/validation.middleware";
import { AuthenticationService } from "./auth.service";

import { IController } from "../../interfaces/controller.interface";
import { ITokenData } from "./auth.interfaces";

import { User } from "./auth.model";
import UserDto from "./auth.dto";
import { IRequest } from "../../interfaces/requests.interface";


export class AuthenticationController implements IController {
    public path = "/auth";
    public router = Router();
    private authenticationService = new AuthenticationService();

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.post(`${this.path}/register`, validationMiddleware(UserDto), this.register);
        this.router.post(`${this.path}/login`, this.login);
        this.router.post(`${this.path}/logout`, this.logout);
    }

    private register = async (req: IRequest, res: Response, next: NextFunction) => {
        try {
            const user = new User({
                email: req.body.email,
                nickname: req.body.nickname,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                birthdate: req.body.birthdate,
                password: req.body.password,
                language: req.body.language || req.locale.language
            });

            const registrationResponse = await this.authenticationService.register(user);

            if (registrationResponse) {
                this.setAuthCookie(res, registrationResponse.authToken);
                res.send({ userToken: registrationResponse.userToken });
            }
        }
        catch (err) { next(err); }
    }

    private login = async (req: IRequest, res: Response, next: NextFunction) => {
        try {
            const loginResponse = await this.authenticationService.login(
                req.body.email,
                req.body.password,
                req.body.language || req.locale.language
            );

            if (loginResponse) {
                this.setAuthCookie(res, loginResponse.authToken);
                res.send({ token: loginResponse.userToken });
            }
        }
        catch (err) {
            next(err);
        }
    }

    private logout = async (req: Request, res: Response) => {
        this.setAuthCookie(res, { token: "", expiresIn: 0 });
        res.sendStatus(200);
    }

    private setAuthCookie(res: Response, tokenData: ITokenData) {
        return res.cookie("Authorization", tokenData.token, { httpOnly: true, maxAge: tokenData.expiresIn });
    }
}