import { Router, Request, Response, NextFunction } from "express";

import authMiddleware from "../../middleware/auth.middleware";

import { IController } from "../../interfaces/controller.interface";

import User, { UserModel } from "../authentication/auth.model";

import { UserNotFoundException } from "../authentication/auth.exceptions";


export class UsersController implements IController {
    public path = "/users";
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.get(`${this.path}/:id`, authMiddleware, this.getUserById);
    }

    private getUserById = async (req: Request, res: Response, next: NextFunction) => {
        User
            .findById(req.params.id)
            .then((user: UserModel) => {
                user.password = undefined;
                res.send(user);
            })
            .catch(err => next(new UserNotFoundException(req.params.id)));
    }

}