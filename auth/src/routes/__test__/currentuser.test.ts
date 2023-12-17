import app from "../../app";
import request from "supertest";

describe("Testing currentuser scenarios", () => {
  it("testing whether the user details are returned upon a valid request", async () => {
    //pre-requisites : [signup]

    const singupResponse = await request(app)
      .post("/api/users/signup")
      .send({ email: "vinay@gmail.com", password: "vinay" })
      .expect(201);

    const cookies = singupResponse.get("Set-Cookie");
    expect(cookies).toBeDefined();

    cookies.forEach((cookie) => expect(cookie).toMatch(/httponly/));

    // now we are testing with super test and it doesn't innately have the mechanism to
    //send the cookie with subsequent requets
    const currentUser = await request(app)
      .get("/api/users/currentuser")
      .set("Cookie", cookies)
      .send()
      .expect(200);

    console.log(currentUser.body);
  });
});
