import mongoose from "mongoose";

class Db {
  constructor() {
    this.init();
  }

  init() {
    mongoose
      .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log("database connected"));
  }
}

export default new Db();
