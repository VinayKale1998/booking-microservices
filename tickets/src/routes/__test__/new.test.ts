import request from "supertest";
import app from "../../app";

describe("testing routes", () => {
  it("has a route handler listening to /api/tickets for post requests", async () => {
    const response = await request(app).post("/api/tickets").send({});

    console.log(response.statusCode);
    expect(response.statusCode).not.toEqual(404);
  });

  it("it can only be accessed if the user is signed in", async () => {
    const response = await request(app).post("/api/tickets").send({});

    expect(response.statusCode).toEqual(401);
  });

  it("returns 201 if the user is signed in", async () => {
    const response = await request(app).post("/api/tickets").send({});

    expect(response.statusCode).toEqual(201);
  });
});
