import request from "supertest";
import app from "../../app";
import { Db } from "../../services/database";
import { AuthController } from "../../controllers";

const mockCreateRequest = {
  email: "test@teste.com",
  password: "123456",
  name: "any_name",
};

const mockLoginRequest = {
  email: "test@teste.com",
  password: "123456",
};

const REFRESH_URL = "/api/auth/refresh";
const LOGOUT_URL = "/api/auth/logout";
const CREATE_URL = "/api/auth/create";
const LOGIN_URL = "/api/auth/login";

async function getMockedRefreshToken() {
  const {
    body: { refresh_token },
  } = await AuthController.create({ body: mockCreateRequest });

  return refresh_token;
}

describe("Auth Routes", () => {
  const db = new Db();
  beforeAll(async () => {
    await db.init();
  });

  afterAll(async () => {
    await db.close();
  });

  afterEach(async () => {
    await db.dropCollection("users");
    await db.dropCollection("session");
  });

  describe("Create", () => {
    it("Should return 200 on Create", async () => {
      await request(app).post(CREATE_URL).send(mockCreateRequest).expect(200);
    });

    it("Should return 400 on invalid email", async () => {
      await request(app)
        .post(CREATE_URL)
        .send({ ...mockCreateRequest, email: "invalid_email" })
        .expect(400);
    });
  });

  describe("Login", () => {
    beforeEach(async () => {
      await AuthController.create({ body: mockCreateRequest });
    });

    it("Should return 200 on Login", async () => {
      await request(app).post(LOGIN_URL).send(mockLoginRequest).expect(200);
    });

    it("Should return 400 on invalid email", async () => {
      await request(app)
        .post(LOGIN_URL)
        .send({ ...mockLoginRequest, email: "invalid_email" })
        .expect(400);
    });

    it("Should return 400 if email doesnt exists", async () => {
      await request(app)
        .post(LOGIN_URL)
        .send({ ...mockLoginRequest, email: "unexistent@email.com" })
        .expect(400);
    });
  });

  describe("Logout", () => {
    let token;
    beforeEach(async () => {
      token = await getMockedRefreshToken();
    });

    it("Should return 204 on Logout", async () => {
      await request(app)
        .delete(LOGOUT_URL)
        .send({ refresh_token: token })
        .expect(204);
    });

    it("Should return 400 on invalid refresh token", async () => {
      await request(app)
        .delete(LOGOUT_URL)
        .send({ refresh_token: null })
        .expect(400);
    });
  });

  describe("Refresh", () => {
    let token;
    beforeEach(async () => {
      token = await getMockedRefreshToken();
    });
    it("Should return 200 on Refresh", async () => {
      await request(app)
        .post(REFRESH_URL)
        .send({ refresh_token: token })
        .expect(200);
    });

    it("Should return 400 on invalid refresh token", async () => {
      await request(app)
        .post(REFRESH_URL)
        .send({ refresh_token: null })
        .expect(400);
    });
  });
});
