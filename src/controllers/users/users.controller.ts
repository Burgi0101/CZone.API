import { Router, Request, Response, NextFunction } from "express";

import authMiddleware from "../../middleware/auth.middleware";
import { UsersService } from "./users.service";

import { IController } from "../../interfaces/controller.interface";


export class UsersController implements IController {
    public path = "/users";
    public router = Router();
    private usersService = new UsersService();

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.get(`${this.path}/:id`, authMiddleware, this.getUserById);
    }

    private getUserById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.usersService.getUserById(req.params.id);

            if (user) {
                res.send(user);
            }
        }
        catch (err) {
            next(err);
        }
    }
}