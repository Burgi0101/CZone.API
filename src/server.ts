import App from "./app";

/* CONTROLLERS */
import { ClubsController } from "./controllers/clubs/clubs.controller";
import { AuthenticationController } from "./controllers/authentication/auth.controller";
import { UsersController } from "./controllers/users/users.controller";

const app = new App(
  [
    new AuthenticationController(),
    new ClubsController(),
    new UsersController()
  ]
);

app.listen();