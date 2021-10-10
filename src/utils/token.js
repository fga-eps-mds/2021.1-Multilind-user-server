import jwt from "jsonwebtoken";

export function createToken(payload, options) {
  return jwt.sign(payload, process.env.JWT_SECRET, options);
}
