import { UserCreateSchema, UserLoginSchema } from "../../validation";
class UserValidation {
  constructor(schema) {
    this.schema = schema;
  }
  async create(req, res, next) {
    const isValid = await UserCreateSchema.isValid(req.body);
    if (!isValid)
      return res.status(400).json({ message: "invalid credentitals" });
    return next();
  }
  async login(req, res, next) {
    const isValid = await UserLoginSchema.isValid(req.body);
    if (!isValid)
      return res.status(400).json({ message: "invalid credentitals" });
    return next();
  }
}

export default new UserValidation();