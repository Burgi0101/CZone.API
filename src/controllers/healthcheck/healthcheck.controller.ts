import { Router, Request, Response } from "express";

import { HealthcheckService } from "./healthcheck.service";

import { IController } from "../../interfaces/controller.interface";

export class HealthcheckController implements IController {
    public path = "/health";
    public router = Router();
    private healthcheckService = new HealthcheckService();

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