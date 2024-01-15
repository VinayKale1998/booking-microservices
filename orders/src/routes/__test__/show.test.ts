import request from "supertest";
import app from "../../app";
import { Ticket } from "../../models/ticket-model";
import mongoose from "mongoose";

describe("testing show route", () => {
  it("fetches the order", async () => {
    //create the ticket
    const ticket = Ticket.build({
      title: "demo",
      price: 20,
      id: new mongoose.Types.ObjectId().toHexString(),
    });

    await ticket.save();

    // make a request to build a new order with this ticket

    const user = global.signup();

    const { body: order } = await request(app)
      .post("/api/orders")
      .set("Cookie", user)
      .send({ ticketId: ticket.id })
      .expect(201);

    // make a request to fetch the order

    const response = await request(app)
      .get(`/api/orders/${order.id}`)
      .set("Cookie", user)
      .send()
      .expect(200);

    expect(response.body.id).toEqual(order.id);
  });

  it(" throw auth error when an order created by one user is tried to be accessed by another user", async () => {
    //build a ticket
    const ticket = Ticket.build({
      title: "demo",
      price: 20,
      id: new mongoose.Types.ObjectId().toHexString(),
    });

    await ticket.save();

    //mock two user cookies
    const user1 = global.signup();
    const user2 = global.signup();
    //build an order with the first cookie
    const { body: order } = await request(app)
      .post("/api/orders")
      .set("Cookie", user1)
      .send({ ticketId: ticket.id })
      .expect(201);

    //try to fetch with 2nd cookie    //assert for 401
    const response = await request(app)
      .get(`/api/orders/${order.id}`)
      .set("Cookie", user2)
      .send()
      .expect(401);
  });
});
