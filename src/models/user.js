import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password_hash: {
      type: String,
      required: true,
    },
  },
  {
    collection: "users",
  }
);

export const User = mongoose.model("user", UserSchema);
