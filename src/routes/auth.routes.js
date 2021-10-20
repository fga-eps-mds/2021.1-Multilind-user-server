import { AuthController } from "../controllers";
import { userValidation } from "../middlewares";
import { adaptRoute } from "../helpers";

import express from "express";

const routes = express.Router();

routes.delete(
  "/logout",
  userValidation.logout,
  adaptRoute(AuthController.logout)
);
routes.post(
  "/refresh",
  userValidation.logout,
  adaptRoute(AuthController.refresh)
);
routes.post(
  "/create",
  userValidation.create,
  adaptRoute(AuthController.create)
);
routes.post("/login", userValidation.login, adaptRoute(AuthController.login));

export default routes;
