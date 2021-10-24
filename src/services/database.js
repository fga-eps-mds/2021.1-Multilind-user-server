import mongoose from "mongoose";

export class Db {
  async init() {
    await mongoose.connect(
      process.env.NODE_ENV === "test"
        ? global.__MONGO_URI__
        : process.env.MONGO_URL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("database connected");
  }

  async close() {
    await mongoose.connection.close();
  }

  async dropCollection(collection) {
    await mongoose.connection.collections[collection].deleteMany({});
  }
}
