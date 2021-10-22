import "dotenv/config";
import express from "express";
import { Db } from "./services/database";
import cors from "cors";
import { requestInfo } from "./middlewares";
import { setUpRoutes } from "./routes";

class App {
  constructor() {
    new Db().init();
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(requestInfo);
    this.app.use(
      cors({
        origin: "*",
        allowedHeaders: "*",
      })
    );
    this.app.use(express.json());
  }

  routes() {
    setUpRoutes(this.app);
  }
}

export default new App().app;
