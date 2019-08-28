import { Router, Request, Response } from "express";

import { IController } from "../../interfaces/controller.interface";
import { HealthcheckService } from "./healthcheck.service";

export class HealthcheckController implements IController {
    path = "/health";
    router = Router();
    healthcheckService = new HealthcheckService();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get(`${this.path}`, this.getHealth);
    }

    private getHealth = async (req: Request, res: Response) => {
        try {
            const isDbConnectionUp = await this.healthcheckService.checkDbConnection();

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