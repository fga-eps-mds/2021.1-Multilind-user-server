import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema(
  {
    refresh_token: {
      type: String,
      required: true,
    },
  },
  {
    collection: "session",
  }
);

export const Session = mongoose.model("session", SessionSchema);
