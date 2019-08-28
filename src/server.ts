import App from "./app";

/* CONTROLLERS */
import { AuthenticationController } from "./controllers/authentication/auth.controller";
import { ClubsController } from "./controllers/clubs/clubs.controller";
import { HealthcheckController } from "./controllers/healthcheck/healthcheck.controller";
import { UsersController } from "./controllers/users/users.controller";


const app = new App(
  [
    new AuthenticationController(),
    new ClubsController(),
    new HealthcheckController(),
    new UsersController()
  ]
);

app.listen();