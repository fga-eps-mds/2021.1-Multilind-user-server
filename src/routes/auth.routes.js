import { AuthController } from "../controllers";
import { userValidation } from "../middlewares";

import express from "express";

const routes = express.Router();

routes.delete("/logout", userValidation.logout, AuthController.logout);
routes.post("/refresh", userValidation.logout, AuthController.refresh);
routes.post("/create", userValidation.create, AuthController.create);
routes.post("/login", userValidation.login, AuthController.auth);

export default routes;
