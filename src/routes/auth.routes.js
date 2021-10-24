import {
  UserCreateSchema,
  UserLoginSchema,
  RefreshTokenSchema,
} from "../validation";

import { AuthController } from "../controllers";
import { Validation } from "../middlewares";
import { adaptRoute, adaptMiddleware } from "../helpers";

import express from "express";

const routes = express.Router();

const crateValidation = new Validation(UserCreateSchema);
const loginValidation = new Validation(UserLoginSchema);
const refreshTokenValidation = new Validation(RefreshTokenSchema);

routes.delete(
  "/logout",
  adaptMiddleware(refreshTokenValidation),
  adaptRoute(AuthController.logout)
);
routes.post(
  "/refresh",
  adaptMiddleware(refreshTokenValidation),
  adaptRoute(AuthController.refresh)
);
routes.post(
  "/create",
  adaptMiddleware(crateValidation),
  adaptRoute(AuthController.create)
);
routes.post(
  "/login",
  adaptMiddleware(loginValidation),
  adaptRoute(AuthController.login)
);

export default routes;
