import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";
import { Ticket } from "../../models/ticket-model";
import { Order, OrderStatus } from "../../models/order-model";

describe("testing order scenarios", () => {
  it("returns an error if the ticket does not exist", async () => {
    const ticketId = new mongoose.Types.ObjectId();

    await request(app)
      .post("/api/orders")
      .set("Cookie", global.signup())
      .send({ ticketId })
      .expect(404);
  });
  it("returns an error if the ticket is already reserved", async () => {
    const ticket = Ticket.build({
      title: "Hello",
      price: 10,
    });

    await ticket.save();

    const order = Order.build({
      ticket,
      userId: "hfslfjs1",
      status: OrderStatus.Created,
      //expiration doesn't matter here as this service doesn't care about it
      expiresAt: new Date(),
    });

    await order.save();

    //send an order creation request for an already reserved ticket
    await request(app)
      .post("/api/orders/")
      .set("Cookie", global.signup())
      .send({ ticketId: ticket.id })
      .expect(400);
  });
  it("reserves a ticket", async () => {
    //building an open ticket, not yet reserved
    const ticket = Ticket.build({
      title: "Hello",
      price: 10,
    });

    await ticket.save();

    await request(app)
      .post("/api/orders/")
      .set("Cookie", global.signup())
      .send({ ticketId: ticket.id })
      .expect(201);
  });

  it.todo("emits an order created event ");
});
