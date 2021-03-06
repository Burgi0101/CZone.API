import express, { Application } from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser = require("cookie-parser");
import createLocaleMiddleware from "express-locale";
import "dotenv/config";

import { errorHandler } from "./middleware/error.middleware";

import { IController } from "./interfaces/controller.interface";

import { CORSException } from "./app.exceptions";

export class App {
    public app: Application;

    constructor(controllers: IController[]) {
        this.app = express();

        this.initializeDBConnection(process.env.MONGO_PATH, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            autoIndex: false, // Don't build indexes
            reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
            reconnectInterval: 500, // Reconnect every 500ms
            poolSize: 10, // Maintain up to 10 socket connections
            // If not connected, return errors immediately rather than waiting for reconnect
            bufferMaxEntries: 0,
            connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        });

        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorHandler();
    }

    private initializeMiddlewares() {
        this.app.use(express.json());
        this.app.use(cookieParser());
        this.app.use(
            cors(this.initializeCorsOptions([
                "http://localhost"
            ]))
        );
        this.app.use(createLocaleMiddleware({
            priority: ["accept-language", "default"],
            default: "de_DE"
        }));
    }

    private initializeCorsOptions(whitelist: string[]): object {
        return {
            origin(origin, callback) {
                if (!origin || whitelist.indexOf(origin) !== -1) {
                    callback(null, true);
                } else {
                    callback(new CORSException());
                }
            }
        };
    }

    private initializeErrorHandler() {
        this.app.use(errorHandler);
    }

    private initializeControllers(controllers: IController[]) {
        controllers.forEach((controller: IController) => {
            this.app.use("/api/", controller.router);
        });
    }

    private initializeDBConnection(connectionString: string, options) {
        try {
            mongoose
                .connect(connectionString, options)
                .then(() => console.log(`Successfully connected to the ${connectionString}`))
                .catch((error) => console.log(error));
        }
        catch (error) { console.log(error); }
    }

    public listen() {
        this.app.listen(process.env.PORT, () => {
            console.log(`App listening on the port ${process.env.PORT}`);
            console.log("Press CTRL-C to stop\n");
        });
    }
}
