import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";
import { Ticket } from "../../models/ticket-model";

const buildTicket = () => {
  const ticket = Ticket.build({
    title: "concet",
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  return ticket;
};

describe("testing  index routes", () => {
  it("fetched orders for a particular user", async () => {
    //create tickets

    const ticketOne = await buildTicket().save();
    const ticketTwo = await buildTicket().save();
    const ticketThree = await buildTicket().save();

    const cookie1 = global.signup();
    const cookie2 = global.signup();
    // create order as one user 1

    await request(app)
      .post("/api/orders")
      .set("Cookie", cookie1)
      .send({ ticketId: ticketOne.id })
      .expect(201);

    // create two orders as user 2
    const { body: orderOne } = await request(app)
      .post("/api/orders")
      .set("Cookie", cookie2)
      .send({ ticketId: ticketTwo.id })
      .expect(201);

    const { body: orderTwo } = await request(app)
      .post("/api/orders")
      .set("Cookie", cookie2)
      .send({ ticketId: ticketThree.id })
      .expect(201);
    //make request to fetch orders of user 2

    const getReponse = await request(app)
      .get("/api/orders")
      .set("Cookie", cookie2)
      .send()
      .expect(200);

    //assert that we have exactly 2 orders for user 2

    expect(getReponse.body.length).toEqual(2);
    expect(getReponse.body[0].id).toEqual(orderOne.id);
    expect(getReponse.body[1].id).toEqual(orderTwo.id);
  });
});
