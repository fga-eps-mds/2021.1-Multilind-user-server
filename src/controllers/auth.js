import { User, Session } from "../models";
import { ecrypt, createToken } from "../utils";
import { pick } from "lodash";

class Auth {
  async create(req, res) {
    try {
      const { name, email, password } = req.body;
      const password_hash = await ecrypt(password);
      const user = await User.create({ name, email, password_hash });

      const tokenPayload = { id: user._id };

      const token = await createToken(tokenPayload, {
        expiresIn: "3600s",
      });

      const refresh_token = await createToken(tokenPayload);

      await Session.create({ refresh_token });

      return res.json({
        token,
        refresh_token,
        user: pick(user, ["name", "email"]),
      });
    } catch (err) {
      return res.status(500).json({ message: err.message || "Server Error" });
    }
  }
  async auth(req, res) {}
  async logout(req, res) {}
  async refresh(req, res) {}
}

export default new Auth();
