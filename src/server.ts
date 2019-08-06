import App from "./app";

import UserController from "./controllers/users/user.controller";
import ClubsController from "./controllers/clubs/clubs.controller";

const app = new App(
  [
    new UserController(),
    new ClubsController()
  ],
  3000,
);

app.listen();