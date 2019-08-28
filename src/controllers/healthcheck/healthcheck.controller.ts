import { Router, Request, Response } from "express";
import mongoose from "mongoose";

import { IController } from "../../interfaces/controller.interface";

export class HealthcheckController implements IController {
    path = "/health";
    router = Router();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get(`${this.path}`, this.getHealth);
    }

    private getHealth = async (req: Request, res: Response) => {
        try {
            const isDbConnectionUp: boolean = await Boolean(mongoose.connection.readyState);

            res.send({
                DatabaseConnection: {
                    up: isDbConnectionUp,
                    timestamp: new Date()
                }
            });
        }
        catch (err) {
            res.send(err);
        }
    }
}