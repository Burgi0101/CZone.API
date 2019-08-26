import { Router, Request, Response, NextFunction } from "express";

import authMiddleware from "../../middleware/auth.middleware";
import validationMiddleware from "../../middleware/validation.middleware";

import { IAuthenticatedRequest } from "../../interfaces/requests.interface";
import { IController } from "../../interfaces/controller.interface";
import { IClub } from "./clubs.interfaces";

import Club from "./clubs.model";
import ClubDto from "./clubs.dto";

import { ClubsService } from "./clubs.service";


export class ClubsController implements IController {
    public path = "/clubs";
    public router = Router();
    private clubsService = new ClubsService();

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.get(`${this.path}`, this.getClubs);
        this.router.get(`${this.path}/:id`, this.getClubById);

        /* AUTHENTICATED ROUTES USER NEEDS TO PASS VALID TOKEN */
        this.router.post(`${this.path}`, authMiddleware, validationMiddleware(ClubDto), this.createClub);
        this.router.put(`${this.path}/:id`, authMiddleware, validationMiddleware(ClubDto, true), this.updateClub);
        this.router.delete(`${this.path}/:id`, authMiddleware, this.deleteClub);
    }

    private getClubs = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const clubs = await this.clubsService.getClubs();

            if (clubs) {
                res.send(clubs.reduce((clubMap, club: IClub) => {
                    if (club.type !== 1) {
                        clubMap[club._id] = club;
                    }
                    return clubMap;
                }, {}));
            }
        }
        catch (err) {
            next(err);
        }
    }

    private getClubById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const club = await this.clubsService.getClubById(req.params.id);

            if (club) {
                res.send(club);
            }
        }
        catch (err) {
            next(err);
        }
    }

    private createClub = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const club = new Club({
                name: req.body.name,
                category: req.body.category,
                managers: [req.user.email],
                type: req.body.type
            });

            const createResponse = await this.clubsService.createClub(club);

            if (createResponse) {
                res.send(createResponse);
            }
        }
        catch (err) {
            next(err);
        }
    }

    private updateClub = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const club: IClub = {
                _id: req.params.id,
                name: req.body.name,
                category: req.body.category,
                managers: req.body.managers,
                type: req.body.type
            };

            const updateClubResponse = await this.clubsService.updateClub(club);

            if (updateClubResponse) {
                res.send(updateClubResponse);
            }
        }
        catch (err) {
            next(err);
        }

    }

    private deleteClub = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const delteClubResponse = await this.clubsService.deleteClub(req.params.id);

            if (delteClubResponse) {
                res.send(delteClubResponse);
            }
        }
        catch (err) {
            next(err);
        }
    }
}
