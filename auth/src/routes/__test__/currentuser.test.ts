import request from "supertest";
import { app } from "../../app";

describe("current user", () => {
  it("response with details about current user", async () => {
    const userEmail = "test@test.com";
    const cookie = await global.signin(userEmail, "password");

    await request(app)
      .get("/api/users/currentuser")
      .set("Cookie", cookie)
      .send()
      .expect(200)
      .then((res) => {
        const { email, id } = res.body.currentUser;

        expect(email).toBe(userEmail);
        expect(id).toBeDefined();
      });
  });

  it("response with 401 when user is not authenticated", async () => {
    await request(app).get("/api/users/currentuser").expect(401);
  });
});
