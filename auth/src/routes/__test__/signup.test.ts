import request from "supertest";
import { app } from "../../app";

describe("auth", () => {
  it("return a 201 on successfull signup", async () => {
    const email = "test@test.com";
    return request(app)
      .post("/api/users/signup")
      .send({ email, password: "password" })
      .expect(201)
      .then((res) => {
        expect(res.body.email).toBe(email);
      });
  });

  it("returns 400 with invalid credentials", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({ email: "test@test.com", password: "p" })
      .expect(400);

    return request(app)
      .post("/api/users/signup")
      .send({ email: "test", password: "password" })
      .expect(400);
  });

  it("returns 400 with missing credentials", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({ email: "test@test.com", password: "" })
      .expect(400);

    return request(app)
      .post("/api/users/signup")
      .send({ email: "", password: "p" })
      .expect(400);
  });

  it("disallows dupliacte emails", async () => {
    const email = "test@test.com";
    await request(app)
      .post("/api/users/signup")
      .send({ email, password: "password" })
      .expect(201);

    return request(app)
      .post("/api/users/signup")
      .send({ email, password: "password" })
      .expect(400);
  });

  it("sets cookie after successful signup", async () => {
    const response = await request(app)
      .post("/api/users/signup")
      .send({ email: "test@test.com", password: "password" })
      .expect(201);

    expect(response.get("Set-Cookie")).toBeDefined();
  });
});
