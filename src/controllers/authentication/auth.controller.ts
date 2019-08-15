import { Router, Request, Response, NextFunction } from "express";

import { IController } from "../../interfaces/controller.interface";
import User, { UserModel } from "./auth.model";
import validationMiddleware from "../../middleware/validation.middleware";
import RegisterUserDto from "./auth.dto";

import { UserAlreadyExistingException, IncorrectCredentialsException } from "./auth.exceptions";

class AuthenticationController implements IController {
    public path = "/auth";
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.post(`${this.path}/register`, validationMiddleware(RegisterUserDto), this.register);
        this.router.post(`${this.path}/login`, this.login);
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
                return res.send(JSON.stringify(user));
            })
            .catch((err) => {
                switch (err.code) {
                    case 11000: return next(new UserAlreadyExistingException(user.email));
                    default: return res.send(err);
                }
            });

    }

    private login = async (req: Request, res: Response, next: NextFunction) => {
        User
            .findOne({ email: req.body.email })
            .then((user: UserModel) => {
                user.schema.methods.comparePassword(req.body.password, user.password, function (err, isMatch) {
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
}

export default AuthenticationController;