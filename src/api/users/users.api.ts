import express, { Router, Request, Response } from "express";

import User, { UserModel } from "./users.model";

const router: Router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
    try {
        const user = new User({
            email: req.body.email,
            nickname: req.body.nickname,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            birthdate: req.body.birthdate,
            password: req.body.password,
        });

        user
            .save()
            .then(() => {
                return res.send(JSON.stringify(user));
            })
            .catch((err) => {
                switch (err.code) {
                    case 11000: return res.status(403).send("There is already a user with this email!");
                    default: return res.send(err);
                }
            });
    }
    catch (error) {
        res.status(500).send(error.toString());
    }
});

router.post("/login", async (req: Request, res: Response) => {
    try {
        User
            .findOne({ email: req.body.email })
            .then((user: UserModel) => {
                user.schema.methods.comparePassword(req.body.password, user.password, function (err, isMatch) {
                    if (err) throw err;
                    if (isMatch) {
                        res.send({ token: user.id });
                    } else {
                        res.status(403).send("Incorrect user credentials!");
                    }
                });
            })
            .catch(err => res.status(403).send("Incorrect user credentials!"));
    }
    catch (error) {
        res.status(500).send(error.toString());
    }
});

export default router;