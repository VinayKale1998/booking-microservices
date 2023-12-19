import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";

describe("testing update routes", () => {
  it("returns  a 404 if the provided id does not exist", async () => {
    const randomValidId = new mongoose.Types.ObjectId().toHexString();
    await request(app)
      .put(`/api/tickets/${randomValidId}`)
      .set("Cookie", global.signup())
      .send({
        title: "title",
        price: 20,
      })
      .expect(404);
  });
  it("returns  a 401 if the user is not authenticated", async () => {
    const randomValidId = new mongoose.Types.ObjectId().toHexString();
    await request(app)
      .put(`/api/tickets/${randomValidId}`)
      .send({
        title: "title",
        price: 20,
      })
      .expect(401);
  });
  it("returns  a 401 if the user does not own the ticket", async () => {
    //create a ticket with one user signup

    const ticketCreation = await request(app)
      .post(`/api/tickets/`)
      .set("Cookie", global.signup())
      .send({
        title: "title",
        price: 20,
      })
      .expect(201);

    //trying to udpate with a new user signup
    await request(app)
      .put(`/api/tickets/${ticketCreation.body.id!}`)
      .set("Cookie", global.signup())
      .send({
        title: "title2",
        price: 21,
      })
      .expect(401);

    //signup with a new user, get his id and check against the id in the previously created ticket
  });
  it("returns  a 400 if the user provides an invalid title or price", async () => {
    //so that we pass the same user even for the put call
    const userCookie = global.signup();

    const ticketCreation = await request(app)
      .post(`/api/tickets/`)
      .set("Cookie", userCookie)
      .send({
        title: "title",
        price: 20,
      })
      .expect(201);

    //a bad request error should be throw from the validateRequest middleware becasue of the empty title
    await request(app)
      .put(`/api/tickets/${ticketCreation.body.id!}`)
      .set("Cookie", userCookie)
      .send({
        title: "",
        price: 21,
      })
      .expect(400);
  });

  it("updates the tickets successfully with 201", async () => {
    const userCookie = global.signup();
    const ticketCreation = await request(app)
      .post(`/api/tickets/`)
      .set("Cookie", userCookie)
      .send({
        title: "title",
        price: 20,
      })
      .expect(201);

    await request(app)
      .put(`/api/tickets/${ticketCreation.body.id!}`)
      .set("Cookie", userCookie)
      .send({
        title: "title2",
        price: 21,
      })
      .expect(200);

    //now check whether or not the ticket actually got updated

    const ticketFetch = await request(app)
      .get(`/api/tickets/${ticketCreation.body.id!}`)
      .send();

    console.log("udpated ticket in the test", ticketFetch.body);
    expect(ticketFetch.body.title).toEqual("title2");
    expect(ticketFetch.body.price).toEqual(21);
  });
});
