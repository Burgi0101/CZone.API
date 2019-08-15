import App from "./app";

/* CONTROLLERS */
import ClubsController from "./controllers/clubs/clubs.controller";
import AuthenticationController from "./controllers/authentication/auth.controller";

const app = new App(
  [
    new AuthenticationController(),
    new ClubsController()
  ]
);

app.listen();