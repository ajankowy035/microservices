import request from "supertest";
import { app } from "../../app";

describe("signin", () => {
  it("sings in an existing user with proper credentials", async () => {
    const email = "test@test.com";
    const password = "password";

    await request(app)
      .post("/api/users/signup")
      .send({ email, password })
      .expect(201);

    const response = await request(app)
      .post("/api/users/signin")
      .send({ email, password })
      .expect(200);

    expect(response.get("Set-Cookie")).toBeDefined();
    expect(response.body.email).toBe(email);
  });

  it("fails when email doesn't exist", async () => {
    const email = "test@test.com";
    const password = "password";

    return request(app)
      .post("/api/users/signin")
      .send({ email, password })
      .expect(400);
  });

  it("fails when password provided is not valid", async () => {
    const email = "test@test.com";

    await request(app)
      .post("/api/users/signup")
      .send({ email, password: "password" })
      .expect(201);

    return request(app)
      .post("/api/users/signin")
      .send({ email, password: "12345" })
      .expect(400);
  });
});
