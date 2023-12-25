import request from "supertest";
import app from "../../app";
import { Ticket } from "../../models/ticketmodel";

describe("testing routes", () => {
  it("has a route handler listening to /api/tickets for post requests", async () => {
    const response = await request(app).post("/api/tickets").send();

    console.log(response.statusCode);
    //should get 401 as the cookie is missing
    expect(response.statusCode).not.toEqual(404);
  });

  it("it can only be accessed if the user is signed in", async () => {
    const response = await request(app).post("/api/tickets").send({});

    expect(response.statusCode).toEqual(401);
  });

  it("returns 200 if the user is signed in", async () => {
    const response = await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signup())
      .send({});
    //should get 400 as the body is absent
    expect(response.statusCode).not.toEqual(401);
  });

  it("returns an error if an invalid title is provided ", async () => {
    await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signup())
      .send({
        title: "",
        price: 10,
      })
      .expect(400);
  });

  it("returns an error if an invalid price is provided ", async () => {
    await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signup())
      .send({
        title: "title",
        price: -10,
      })
      .expect(400);

    await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signup())
      .send({
        title: "title",
      })
      .expect(400);
  });

  it("creates a ticket with valid inputs", async () => {
    let tickets = await Ticket.find({});

    expect(tickets.length).toEqual(0);

    await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signup())
      .send({ title: "title", price: 20 })
      .expect(201);

    tickets = await Ticket.find({});

    expect(tickets.length).toEqual(1);
  });
});
