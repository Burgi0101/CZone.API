import { Router, Request, Response, NextFunction } from "express";

import authMiddleware from "../../middleware/auth.middleware";
import validationMiddleware from "../../middleware/validation.middleware";

import { IAuthenticatedRequest } from "../../interfaces/requests.interface";
import { IController } from "../../interfaces/controller.interface";
import { IClub } from "./clubs.interfaces";

import Club, { ClubModel } from "./clubs.model";
import ClubDto from "./clubs.dto";

import { ClubNotFoundException } from "./clubs.exceptions";
import { ClubsService } from "./clubs.service";


export class ClubsController implements IController {
    public path = "/clubs";
    public router = Router();
    private clubsSerivce = new ClubsService();

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
            const clubs = await this.clubsSerivce.getClubs();

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
            const club = await this.clubsSerivce.getClubById(req.params.id);

            res.send(club);
        }
        catch (err) {
            next(err);
        }
    }

    private createClub = async (req: IAuthenticatedRequest, res: Response) => {
        try {
            const club = new Club({
                name: req.body.name,
                category: req.body.category,
                managers: [req.user.email],
                type: req.body.type
            });

            club
                .save()
                .then(() => {
                    return res.send(JSON.stringify(club));
                })
                .catch((err) => {
                    return res.send(err);
                });
        }
        catch (error) {
            res.status(500).send(error.toString());
        }
    }

    private updateClub = async (req: Request, res: Response, next: NextFunction) => {

        const updatedClub: IClub = {
            _id: req.params.id,
            name: req.body.name,
            category: req.body.category,
            managers: req.body.managers,
            type: req.body.type
        };

        Club
            .findByIdAndUpdate(
                req.params.id,
                updatedClub,
                { new: true }
            )
            .then((club: ClubModel | null) => {
                res.send(club);
            })
            .catch(err => next(new ClubNotFoundException(req.params.id)));
    }

    private deleteClub = async (req: Request, res: Response, next: NextFunction) => {

        Club
            .findByIdAndDelete(req.params.id)
            .then((club: ClubModel | null) => {
                res.send(club);
            })
            .catch(err => next(new ClubNotFoundException(req.params.id)));
    }
}
