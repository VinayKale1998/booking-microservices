import request from "supertest";
import app from "../../app";
import { Ticket } from "../../models/ticket-model";

describe("testing show route", () => {
  it("fetches the order", async () => {
    //create the ticket
    const ticket = Ticket.build({
      title: "demo",
      price: 20,
    });

    await ticket.save();

    // make a request to build a new order with this ticket

    const user = global.signup();

    const { body: order } = await request(app)
      .post("/api/orders")
      .set("Cookie", user)
      .send({ ticketId: ticket.id })
      .expect(201);

    console.log("inside fetches the order", order);
    // make a request to fetch the order

    console.log("inside fetches the order", ticket.id);

    const response = await request(app)
      .get(`/api/orders/${order.id}`)
      .set("Cookie", user)
      .send()
      .expect(200);

    expect(response.body.id).toEqual(order.id);
  });
});
