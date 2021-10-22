import authRoutes from "./auth.routes";

export function setUpRoutes(app) {
  app.use("/api/auth", [authRoutes]);
}
