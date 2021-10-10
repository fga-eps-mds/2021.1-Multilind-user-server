import { AuthController } from "../controllers";
import { userValidation } from "../middlewares";

import express from "express";

const routes = express.Router();

routes.post("/create", userValidation.create, AuthController.create);

export default routes;
