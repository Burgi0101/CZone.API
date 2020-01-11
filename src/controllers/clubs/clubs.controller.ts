import { Router, Request, Response, NextFunction } from "express";

import { authMiddleware } from "../../middleware/auth.middleware";
import { validationMiddleware } from "../../middleware/validation.middleware";
import { ClubsService } from "./clubs.service";

import { IAuthenticatedRequest } from "../../interfaces/requests.interface";
import { IController } from "../../interfaces/controller.interface";

import { Club, ClubModel } from "./clubs.model";
import ClubDto from "./clubs.dto";


export class ClubsController implements IController {
    public path = "/clubs";
    public router = Router();
    private clubsService = new ClubsService();

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.get(`${this.path}`, this.getClubs);

        /* AUTHENTICATED ROUTES, USER NEEDS TO PASS VALID AUTH-TOKEN */
        this.router.get(`${this.path}/:id`, authMiddleware, this.getClubById);
        this.router.post(`${this.path}`, authMiddleware, validationMiddleware(ClubDto), this.createClub);
        this.router.put(`${this.path}/:id`, authMiddleware, validationMiddleware(ClubDto, true), this.updateClub);
        this.router.delete(`${this.path}/:id`, authMiddleware, this.deleteClub);
    }

    private getClubs = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const clubs: ClubDto[] = await this.clubsService.getClubs();

            if (clubs) {
                res.send(clubs.reduce((clubMap, club: ClubModel) => {
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

    private getClubById = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const club: ClubDto = await this.clubsService.getClubById(req.params.id, req.user.language);

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

            const createResponse: ClubDto = await this.clubsService.createClub(club, req.user.language);

            if (createResponse) {
                res.send(createResponse);
            }
        }
        catch (err) {
            next(err);
        }
    }

    private updateClub = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const fallbackRequestorIsManager = [req.user.email];
            const managers = req.body.managers === undefined ? fallbackRequestorIsManager : req.body.managers.length === 0 ? fallbackRequestorIsManager : req.body.managers;

            const club = new Club({
                _id: req.params.id,
                name: req.body.name,
                category: req.body.category,
                managers,
                type: req.body.type
            });

            const updateClubResponse: ClubDto = await this.clubsService.updateClub(club, req.user);

            if (updateClubResponse) {
                res.send(updateClubResponse);
            }
        }
        catch (err) {
            next(err);
        }
    }

    private deleteClub = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const delteClubResponse: ClubDto = await this.clubsService.deleteClub(req.params.id, req.user);

            if (delteClubResponse) {
                res.send(delteClubResponse);
            }
        }
        catch (err) {
            next(err);
        }
    }
}
