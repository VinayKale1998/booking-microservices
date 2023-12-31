import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";

describe("testing show route", () => {
  it("returns a 404 if the ticket is not found", async () => {
    const randomValidId = new mongoose.Types.ObjectId().toHexString();
    await request(app).get(`api/tickets/${randomValidId}`).send().expect(404);
  });

  it("returns the ticket if the ticket is found", async () => {
    const title = "title";
    const price = 20;

    const creationResponse = await request(app)
      .post("/api/tickets/")
      .set("Cookie", global.signup())
      .send({ title, price })
      .expect(201);

    console.log("ticket creation response", creationResponse.body);
    const ticketResponse = await request(app)
      .get(`/api/tickets/${creationResponse.body.id}`)
      .send()
      .expect(200);

    expect(ticketResponse.body.title).toEqual(title);
    expect(ticketResponse.body.price).toEqual(price);
  });
});
