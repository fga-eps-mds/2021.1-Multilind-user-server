import { User, Session } from "../models";
import { ecrypt, validateData, createToken, validateToken } from "../utils";
import { pick } from "lodash";

import { ok, serverError, badRequest, noContent } from "../utils/httpResponses";

class Auth {
  async create(httpRequest) {
    try {
      const { name, email, password } = httpRequest.body;

      const passwordHash = await ecrypt(password);

      const isEmailAlreadyUsed = await User.findOne({ email });
      if (isEmailAlreadyUsed) {
        return badRequest({
          message: "Email já está em uso por outro usuário",
        });
      }
      const user = await User.create({
        name,
        email,
        password_hash: passwordHash,
      });

      const tokenPayload = { id: user._id };

      const token = await createToken(tokenPayload, {
        expiresIn: "3600s",
      });

      const refreshToken = await createToken(tokenPayload);

      await Session.create({ refresh_token: refreshToken });
      return ok({
        token,
        refresh_token: refreshToken,
        user: pick(user, ["name", "email"]),
      });
    } catch (error) {
      return serverError(error);
    }
  }
  async login(httpRequest) {
    try {
      const { email, password } = httpRequest.body;

      const user = await User.findOne({ email });
      if (!user) {
        return badRequest({
          message: "Credenciais inválidas.",
        });
      }

      const isPasswordValid = await validateData(password, user.password_hash);
      if (!isPasswordValid) {
        return badRequest({
          message: "Credenciais inválidas.",
        });
      }
      const tokenPayload = { id: user._id };
      const token = await createToken(tokenPayload, {
        expiresIn: "3600s",
      });

      const refreshToken = await createToken(tokenPayload);

      await Session.create({ refresh_token: refreshToken });

      return ok({
        token,
        refresh_token: refreshToken,
        user: pick(user, ["name", "email"]),
      });
    } catch (error) {
      return serverError(error);
    }
  }

  async logout(httpRequest) {
    try {
      const { refresh_token: refreshToken } = httpRequest.body;
      const isSectionActive = await Session.findOne({
        refresh_token: refreshToken,
      });
      if (!isSectionActive) {
        return badRequest({
          message: "Não Há sessões ativas para esse email",
        });
      }
      await Session.deleteOne({ refresh_token: refreshToken });
      return noContent();
    } catch (err) {
      return serverError();
    }
  }
  async refresh(httpRequest) {
    try {
      const { refresh_token: refreshToken } = httpRequest.body;
      const { valid, payload } = await validateToken(refreshToken);

      if (!valid) {
        return badRequest({
          message: "invalid token",
        });
      }

      const isSessionValid = await Session.findOne({
        refresh_token: refreshToken,
      });
      if (!isSessionValid) {
        return badRequest({
          message: "invalid token",
        });
      }

      const newToken = await createToken(payload);

      return ok({ token: newToken });
    } catch (err) {
      return serverError();
    }
  }
}

export default new Auth();
