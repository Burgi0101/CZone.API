import mongoose from "mongoose";

export class HealthcheckService {

    public checkDbConnection() {
        return Boolean(mongoose.connection.readyState);
    }
}