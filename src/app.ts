import express from "express";
import mongoose from "mongoose";

import clubs from "./api/clubs/clubs.api";
import users from "./api/users/users.api";

/* DB CONNECTION OPTIONS*/
const options = {
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
};

/* DB CONNECTION */
const db = "mongodb://localhost:27017/local";

mongoose
  .connect(
    db,
    options
  )
  .then(
    () => { console.log(`Successfully connected to the ${db}`); },
    error => { console.log(error); }
  );

/* CREATE NEW EXPRESS INSTANCE */
const app: express.Application = express();

/* MIDDLEWARES */
app.use(express.json());

/* APP ROUTES */
app.use("/api/clubs", clubs);
app.use("/api/users", users);

/* STARTING SERVE ON GIVEN PORT */

const port = process.env.PORT || "3000";

app.listen(port, () => {
  console.log(`\nServer listening on port ${port}`);
  console.log("Press CTRL-C to stop\n");
});