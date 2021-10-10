import { User, Session } from "../models";
import { ecrypt, validateData, createToken, validateToken } from "../utils";
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
      return res
        .status(err.status || 500)
        .json({ message: err.message || "Server Error" });
    }
  }
  async auth(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        throw {
          status: 400,
          message: "invalid credentials",
        };
      }

      const isPasswordValid = await validateData(password, user.password_hash);
      if (!isPasswordValid) {
        throw {
          status: 400,
          message: "invalid credentials",
        };
      }

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
      return res
        .status(err.status || 500)
        .json({ message: err.message || "Server Error" });
    }
  }
  async logout(req, res) {
    try {
      const { refresh_token } = req.body;
      await Session.deleteOne({ refresh_token });
      return res.sendStatus(204);
    } catch (err) {
      return res
        .status(err.status || 500)
        .json({ message: err.message || "Server Error" });
    }
  }
  async refresh(req, res) {
    try {
      const { refresh_token } = req.body;
      const { valid, payload } = await validateToken(refresh_token);
      if (!valid)
        throw {
          status: 400,
          message: "invalid token",
        };

      const isSessionValid = await Session.findOne({ refresh_token });
      if (!isSessionValid)
        throw {
          status: 400,
          message: "invalid token",
        };

      const newToken = await createToken(payload);

      return res.json({ token: newToken });
    } catch (err) {
      return res
        .status(err.status || 500)
        .json({ message: err.message || "Server Error" });
    }
  }
}

export default new Auth();
