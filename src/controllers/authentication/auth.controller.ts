import { Router, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { IController } from "../../interfaces/controller.interface";
import { ITokenData, IDataStoredInToken } from "./auth.interfaces";

import User, { UserModel } from "./auth.model";
import validationMiddleware from "../../middleware/validation.middleware";
import UserDto from "./auth.dto";

import { UserAlreadyExistingException, IncorrectCredentialsException } from "./auth.exceptions";


class AuthenticationController implements IController {
    public path = "/auth";
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.post(`${this.path}/register`, validationMiddleware(UserDto), this.register);
        this.router.post(`${this.path}/login`, this.login);
        this.router.post(`${this.path}/logout`, this.logout);
    }

    private register = async (req: Request, res: Response, next: NextFunction) => {
        const user = new User({
            email: req.body.email,
            nickname: req.body.nickname,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            birthdate: req.body.birthdate,
            password: req.body.password,
        });

        user
            .save()
            .then(() => {
                const tokenData = this.createToken(user);
                this.setAuthCookie(res, tokenData);
                res.send(user);
            })
            .catch((err) => {
                switch (err.code) {
                    case 11000: next(new UserAlreadyExistingException(user.email)); break;
                    default: res.send(err);
                }
            });

    }

    private login = async (req: Request, res: Response, next: NextFunction) => {
        User
            .findOne({ email: req.body.email })
            .then((user: UserModel) => {
                const tokenData = this.createToken(user);
                this.setAuthCookie(res, tokenData);

                user.schema.methods.comparePassword(req.body.password, user.password, function (err, isMatch: boolean) {
                    if (err) throw err;
                    if (isMatch) {
                        res.send({ token: user.id });
                    } else {
                        next(new IncorrectCredentialsException());
                    }
                });
            })
            .catch(err => next(new IncorrectCredentialsException()));
    }

    private logout = async (req: Request, res: Response) => {
        res.setHeader("Set-Cookie", ["Authorization=;Max-age=0"]);
        res.sendStatus(200);
    }

    private createToken(user: UserModel): ITokenData {
        const expiresIn = 60 * 60; // an hour
        const secret = "AHAHABLABLA";
        const dataStoredInToken: IDataStoredInToken = {
            _id: user._id,
        };
        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
        };
    }

    private setAuthCookie(res: Response, tokenData: ITokenData) {
        return res.cookie("Authorization", tokenData.token, { httpOnly: true, maxAge: tokenData.expiresIn });
    }
}



export default AuthenticationController;