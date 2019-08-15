import express, { Application } from "express";
import mongoose from "mongoose";

import errorHandler from "./middleware/error.middleware";
import { IController } from "./interfaces/controller.interface";

class App {
    public app: Application;
    public port: number;

    constructor(controllers: IController[], port) {
        this.app = express();
        this.port = port;

        this.initializeDBConnection("mongodb://localhost:27017/local", {
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
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
            console.log("Press CTRL-C to stop\n");
        });
    }
}

export default App;