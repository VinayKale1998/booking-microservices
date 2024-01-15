import request from "supertest";
import app from "../../app";
import { Ticket } from "../../models/ticket-model";
import { OrderStatus } from "@vr-vitality/common";
import { natsWrapper } from "../../nats-wrapper";
import mongoose from "mongoose";

describe("testing delete route", () => {
  it("it marks an order cancelled", async () => {
    //create the ticket
    const ticket = Ticket.build({
      title: "demo",
      price: 20,
      id: new mongoose.Types.ObjectId().toHexString(),
    });

    await ticket.save();

    const user = global.signup();
    //make a request to create an order
    const { body: order } = await request(app)
      .post("/api/orders/")
      .set("Cookie", user)
      .send({ ticketId: ticket.id })
      .expect(201);

    console.log("inside order cancellation testing", order.id);
    // make a request to cancel an order
    await request(app)
      .delete(`/api/orders/${order.id}`)
      .set("Cookie", user)
      .send()
      .expect(204);

    //fetch the  order again  and check if the status is cancelled
    const { body: cancelledOrder } = await request(app)
      .get(`/api/orders/${order.id}`)
      .set("Cookie", user)
      .send()
      .expect(200);

    expect(cancelledOrder.status).toEqual(OrderStatus.Cancelled);
  });

  it("returns auth error when a different user tries to cancel the order", async () => {
    //create the ticket
    const ticket = Ticket.build({
      title: "demo",
      price: 20,
      id: new mongoose.Types.ObjectId().toHexString(),
    });

    await ticket.save();

    //make a request to create an order
    const { body: order } = await request(app)
      .post("/api/orders/")
      .set("Cookie", global.signup())
      .send({ ticketId: ticket.id })
      .expect(201);

    console.log("inside order cancellation testing", order.id);
    // make a request to cancel an order
    const { body: cancelledOrder } = await request(app)
      .delete(`/api/orders/${order.id}`)
      .set("Cookie", global.signup())
      .send()
      .expect(401);
  });

  it(" emits an order cancelled event", async () => {
    //create the ticket
    const ticket = Ticket.build({
      title: "demo",
      price: 20,
      id: new mongoose.Types.ObjectId().toHexString(),
    });

    await ticket.save();

    const user = global.signup();
    //make a request to create an order
    const { body: order } = await request(app)
      .post("/api/orders/")
      .set("Cookie", user)
      .send({ ticketId: ticket.id })
      .expect(201);

    console.log("inside order cancellation testing", order.id);
    // make a request to cancel an order
    await request(app)
      .delete(`/api/orders/${order.id}`)
      .set("Cookie", user)
      .send()
      .expect(204);

    //fetch the  order again  and check if the status is cancelled
    const { body: cancelledOrder } = await request(app)
      .get(`/api/orders/${order.id}`)
      .set("Cookie", user)
      .send()
      .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
    // because there's a create flow above that also emits an event,hence 2 in total
  });
});
