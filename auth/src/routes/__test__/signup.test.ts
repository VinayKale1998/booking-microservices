import request from "supertest";
import app from "../../app";

describe(" Signup scenarios", () => {
  it("Returns 201 on successful signup creation", async () => {
    return request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(201);
  });

  //negative scenarios
  it("Returns 400 upon sending invalid email ", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({
        email: "sfsf",
        password: "sfsf",
      })
      .expect(400);
  });
  it("Returns 400 upon sending invalid password ", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({
        email: "vinay@gmail.com",
        password: "12",
      })
      .expect(400);
  });

  //verifying duplicate signup being refused

  it("Returns 400 upon sending a duplicate signup request", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({
        email: "vinaykale@gmail.com",
        password: "hello",
      })
      .expect(201);

    await request(app)
      .post("/api/users/signup")
      .send({
        email: "vinaykale@gmail.com",
        password: "hello",
      })
      .expect(400);
  });

  //this will inherenetly fail, because our app is setup to only provide cookies over an https connection
  it("sets a  cookie after successful singup", async () => {
    const response = await request(app)
      .post("/api/users/signup")
      .send({
        email: "vinaykale@gmail.com",
        password: "hello",
      })
      .expect(201);

    expect(response.get("Set-Cookie")).toBeDefined();
  });
});
