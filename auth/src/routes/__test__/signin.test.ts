import app from "../../app";
import request from "supertest";

describe("testing signin scenarios", () => {
  it("Returns 200 upon successful signin", async () => {
    //pre-requisites: [signup]

    await request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(201);

    //now check if signin works with the same credentials

    await request(app)
      .post("/api/users/signin")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(200);
  });

  //negative
  it("Returns 400 upon sending invalid email", async () => {
    await request(app)
      .post("/api/users/signin")
      .send({
        email: "test@",
        password: "password",
      })
      .expect(400);
  });

  it("Returns 401 upon sending a wrong password for a valid signed up email", async () => {
    await signup();

    //now change the password for signin
    await request(app)
      .post("/api/users/signin")
      .send({
        email: "test@test.com",
        password: "pass",
      })
      .expect(401);
  });

  it("Verify Set-Cookie presence in the respone header", async () => {
    //pre-requisite : signup
    await request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(201);

    const respone = await request(app)
      .post("/api/users/signin")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(200);

    expect(respone.get("Set-Cookie")).toBeDefined();
  });
});
