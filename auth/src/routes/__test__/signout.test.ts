import app from "../../app";
import request from "supertest";

describe("testing signout scenarios", () => {
  it("clears the cookie after signing out", async () => {
    //pre-requisites: [signup]

    await request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(201);

    //cookie will already be set, we have to remove it now and assert for absence
    const response = await request(app).get("/api/users/signout").expect(200);

    //first check of Set cookie is defined, if yes, check if jwt is present.
    const setCookieHeaders = response.get("Set-Cookie");
    expect(setCookieHeaders).toBeDefined();
    setCookieHeaders.forEach((cookie) => {
      expect(cookie).not.toMatch(/jwt/);
    });
  });
});
