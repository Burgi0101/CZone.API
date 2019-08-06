import { Router, Request, Response } from "express";

import { IClub } from "./clubs.interfaces";
import Club, { ClubModel } from "./clubs.model";

class ClubsController {
    public path = "/clubs";
    public router = Router();

    constructor() {
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.get(`${this.path}`, this.getClubs);
        this.router.get(`${this.path}/:id`, this.getClubsById);
        this.router.post(`${this.path}`, this.createClub);
        this.router.put(`${this.path}/:id`, this.updateClub);
        this.router.delete(`${this.path}/:id`, this.updateClub);
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

    getClubsById = async (req: Request, res: Response) => {
        try {
            Club
                .findById(req.params.id)
                .then((club: ClubModel | null) => {
                    res.send(club);
                })
                .catch(err => res.status(404).send("The Club you are looking for does not exist!"));
        }
        catch (error) {
            res.status(500).send(error.toString());
        }
    }

    createClub = async (req: Request, res: Response) => {
        try {
            const club = new Club({
                name: req.body.name,
                category: req.body.category,
                manager: req.body.manager,
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

    updateClub = async (req: Request, res: Response) => {
        try {

            const updatedClub: IClub = {
                _id: req.params.id,
                name: req.body.name,
                category: req.body.category,
                manager: req.body.manager,
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
                .catch(err => res.status(404).send("The Club you are trying to update does not exist!"));
        }
        catch (error) {
            res.status(500).send(error.toString());
        }
    }

    deleteClub = async (req: Request, res: Response) => {
        try {
            Club
                .findByIdAndDelete(req.params.id)
                .then((club: ClubModel | null) => {
                    res.send(club);
                })
                .catch(err => res.status(404).send("The Club you are trying to delete does not exist!"));
        }
        catch (error) {
            res.status(500).send(error.toString());
        }
    }
}

export default ClubsController;