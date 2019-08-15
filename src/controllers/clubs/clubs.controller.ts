import { Router, Request, Response, NextFunction } from "express";

import { IController } from "../../interfaces/controller.interface";
import { IClub } from "./clubs.interfaces";

import Club, { ClubModel } from "./clubs.model";
import { ClubNotFoundException } from "./clubs.exceptions";
import validationMiddleware from "../../middleware/validation.middleware";
import CreateClubDto from "./clubs.dto";


class ClubsController implements IController {
    public path = "/clubs";
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.get(`${this.path}`, this.getClubs);
        this.router.get(`${this.path}/:id`, this.getClubById);
        this.router.post(`${this.path}`, validationMiddleware(CreateClubDto), this.createClub);
        this.router.put(`${this.path}/:id`, validationMiddleware(CreateClubDto, true), this.updateClub);
        this.router.delete(`${this.path}/:id`, this.deleteClub);
    }

    getClubs = async (req: Request, res: Response) => {
        try {
            Club
                .find({})
                .then((clubs) => {
                    res.send(clubs.reduce((clubMap, club: IClub) => {
                        clubMap[club._id] = club;
                        return clubMap;
                    }, {}));
                })
                .catch(err => res.send(err));
        }
        catch (error) {
            res.status(500).send(error.toString());
        }
    }

    getClubById = async (req: Request, res: Response, next: NextFunction) => {
        Club
            .findById(req.params.id)
            .then((club: ClubModel | null) => {
                res.send(club);
            })
            .catch(err => next(new ClubNotFoundException(req.params.id)));
    }

    createClub = async (req: Request, res: Response) => {
        try {
            const club = new Club({
                name: req.body.name,
                category: req.body.category,
                managers: req.body.managers,
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

    updateClub = async (req: Request, res: Response, next: NextFunction) => {

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

    deleteClub = async (req: Request, res: Response, next: NextFunction) => {
        Club
            .findByIdAndDelete(req.params.id)
            .then((club: ClubModel | null) => {
                res.send(club);
            })
            .catch(err => next(new ClubNotFoundException(req.params.id)));
    }
}

export default ClubsController;
